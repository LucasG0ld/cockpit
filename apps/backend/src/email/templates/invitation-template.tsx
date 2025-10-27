import * as React from 'react';

interface InvitationEmailTemplateProps {
  token: string;
}

export const InvitationEmailTemplate: React.FC<Readonly<InvitationEmailTemplateProps>> = ({ token }) => {
  const invitationLink = `http://localhost:3000/accept-invitation?token=${token}`;

  return (
    <div>
      <h1>You have been invited to join an organization!</h1>
      <p>Click the link below to accept the invitation:</p>
      <a href={invitationLink}>Accept Invitation</a>
    </div>
  );
};
