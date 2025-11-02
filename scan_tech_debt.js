// /scripts/scan_tech_debt.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
const FOLDERS_TO_SCAN = ['apps', 'packages', 'src', '.windsurf']; // Dossiers à scanner en mode --all
const IGNORE_PATTERNS = ['node_modules', '.git', 'dist', 'build', '.DS_Store', '.env', '.env.local']; // Fichiers/dossiers à toujours ignorer
const OUTPUT_DIR = 'reports/tech-debt'; // Dossier de sortie pour les rapports
// --- Fin de la Configuration ---

/**
 * Fonction pour s'assurer que le répertoire de sortie existe.
 */
function ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
}

/**
 * Fonction pour trouver tous les fichiers à scanner de manière récursive (scan complet).
 * @param {string} dir - Le répertoire de départ.
 * @returns {string[]} - Une liste de chemins de fichiers.
 */
function getAllFiles(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (IGNORE_PATTERNS.some(pattern => entry.name.includes(pattern))) {
            continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getAllFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

/**
 * Fonction pour obtenir uniquement les fichiers modifiés par rapport à la branche main (scan différentiel).
 * @returns {string[]} - Une liste de chemins de fichiers modifiés.
 */
function getDiffFiles() {
    try {
        const mainBranch = 'main'; // Ou 'master' si c'est votre branche principale
        const diffOutput = execSync(`git diff --name-only ${mainBranch}...HEAD`).toString().trim();
        if (!diffOutput) return [];
        return diffOutput.split('\n').filter(file => fs.existsSync(file)); // Ne retourne que les fichiers qui existent encore
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers modifiés. Assurez-vous d\'être dans un dépôt Git avec une branche "main".');
        process.exit(1);
    }
}

/**
 * Fonction pour parser un fichier à la recherche de commentaires TECH_DEBT.
 * @param {string} filePath - Le chemin du fichier à lire.
 * @returns {object[]} - Une liste d'objets représentant la dette technique.
 */
function parseFileForTechDebt(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const debts = [];
    const debtRegex = /\[TECH_DEBT\] - ([\d-]+) - \[CRITICALITY: (MINOR|MAJOR)\]/;

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(debtRegex);
        if (match) {
            const debt = {
                date: match[1],
                criticality: match[2],
                description: lines[i + 1]?.split('Description:')[1]?.trim() || 'N/A',
                impact: lines[i + 2]?.split('Impact:')[1]?.trim() || 'N/A',
                suggestion: lines[i + 3]?.split('Suggestion:')[1]?.trim() || 'N/A',
                file: filePath,
                line: i + 1,
            };
            debts.push(debt);
        }
    }
    return debts;
}

/**
 * Fonction pour obtenir le lien GitHub d'un fichier à une ligne spécifique.
 * @param {string} filePath - Le chemin du fichier.
 * @param {number} line - Le numéro de ligne.
 * @returns {string} - L'URL GitHub.
 */
function getGitHubLink(filePath, line) {
    try {
        const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        const httpUrl = remoteUrl.replace(':', '/').replace('git@', 'https://').replace('.git', '');
        return `${httpUrl}/blob/${branch}/${filePath.replace(/\\/g, '/')}#L${line}`;
    } catch (error) {
        return 'N/A';
    }
}

/**
 * Fonction principale.
 */
function main() {
    const args = process.argv.slice(2);
    const isDiffMode = args.includes('--diff');
    
    console.log(`Lancement du scan de la dette technique en mode : ${isDiffMode ? 'Différentiel (fichiers modifiés)' : 'Complet'}`);
    
    let filesToScan = [];
    if (isDiffMode) {
        filesToScan = getDiffFiles();
    } else {
        const rootFiles = getAllFiles(process.cwd());
        filesToScan = rootFiles.filter(file =>
            FOLDERS_TO_SCAN.some(folder => path.normalize(file).startsWith(path.normalize(folder)))
        );
    }

    if (filesToScan.length === 0) {
        console.log('Aucun fichier à scanner.');
        return;
    }

    console.log(`Scan de ${filesToScan.length} fichier(s)...`);
    let allDebts = [];
    for (const file of filesToScan) {
        allDebts = allDebts.concat(parseFileForTechDebt(file));
    }

    if (allDebts.length === 0) {
        console.log('Aucune nouvelle dette technique trouvée dans les fichiers scannés. Excellent travail !');
        return;
    }

    // Tri des dettes
    allDebts.sort((a, b) => {
        if (a.criticality === 'MAJOR' && b.criticality !== 'MAJOR') return -1;
        if (a.criticality !== 'MAJOR' && b.criticality === 'MAJOR') return 1;
        return new Date(b.date) - new Date(a.date);
    });

    // Génération du rapport Markdown
    const dateStamp = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const outputFilename = path.join(OUTPUT_DIR, `TECH_DEBT_REPORT_${dateStamp}.md`);

    let reportContent = `# Rapport de Dette Technique\n\n`;
    reportContent += `**Date de Génération :** ${new Date().toISOString()}\n`;
    reportContent += `**Mode de Scan :** ${isDiffMode ? 'Différentiel' : 'Complet'}\n`;
    reportContent += `Total des dettes identifiées : **${allDebts.length}**\n\n`;
    reportContent += `| Criticité | Date       | Description                                  | Fichier (Lien Direct) |\n`;
    reportContent += `|-----------|------------|----------------------------------------------|-----------------------|\n`;

    for (const debt of allDebts) {
        const link = `[${path.basename(debt.file)}:${debt.line}](${getGitHubLink(debt.file, debt.line)})`;
        reportContent += `| ${debt.criticality} | ${debt.date} | ${debt.description} | ${link} |\n`;
    }

    ensureOutputDir();
    fs.writeFileSync(outputFilename, reportContent);
    console.log(`Rapport généré avec succès : ${outputFilename}`);
}

main();