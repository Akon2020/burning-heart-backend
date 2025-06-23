const currentYear = new Date().getFullYear();

export const newUserEmailTemplate = (nom, email, defaultPassword, url) => {
  return `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style=" max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <td align="center" style="padding-bottom: 20px;">
        <img src="https://burningheart.netlify.app/img/NavLogo.png" alt="Logo" style="max-width: 100%; width: auto; height: 5rem;">
    </td>
    <h2 style="color: #333333">Bienvenue ${nom} 👋!</h2>
    <p style="color: #555555">Votre compte a été créé avec succès pour l'adresse email : <strong style="text-align: center">${email}</strong></p>
    <p style="color: #555555">Voici votre mot de passe par défaut pour votre première connexion :</p>
    <div style="background-color: #f2f2f2; padding: 10px; border-radius: 5px; margin: 10px 0; text-align: center;">
      <strong style="font-size: 1.2em; color: #a42223;">${defaultPassword}</strong>
    </div>
    <p style="color: #555555"><strong>Important :</strong> Pour des raisons de sécurité, veuillez vous connecter au système en utilisant ce mot de passe par défaut et le modifier immédiatement avant d'accéder aux autres fonctionnalités.</p>
    <p style="color: #555555">Cliquez sur le lien ci-dessous pour accéder à la page de connexion :</p>
    <p style="text-align: center;">
      <a href="${url}" style="background-color: #a42223; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">Se connecter au système</a>
    </p>
    <p style="color: #555555">Après votre connexion et le changement de mot de passe, vous pourrez profiter pleinement de toutes les fonctionnalités de notre système.</p>
    <p style="color: #555555">A très bientôt 😇,</p>
    <p style="color: #555555">L'équipe de <a href="${url}" style="color: #a42223; text-decoration: none">BurningHeart</a></p>
    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0" />
    <p style="color: #999999">Ce message a été envoyé automatiquement suite à la création de votre compte. Merci de ne pas y répondre.</p>
    <p style="color: #999999; text-align: center;">&copy; ${currentYear} HostoGest – Tous droits réservés</p>
    </div>
</div>`;
};


export const confirmationReceptionEmailTemplate = (nom, url) => {
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; padding: 40px 1rem;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
          
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="https://burningheart.netlify.app/img/NavLogo.png" alt="Logo" style="max-width: 100%; width: auto; height: 5rem;">
            </td>
          </tr>
  
          <tr>
            <td align="center" style="color: #a42223; font-size: 24px; font-weight: bold; padding-bottom: 16px;">
              Confirmation de Réception
            </td>
          </tr>
  
          <tr>
            <td style="color: #333333; font-size: 16px; padding-bottom: 16px;">
              Bonjour ${nom},
            </td>
          </tr>
          <tr>
            <td style="color: #555555; font-size: 15px; line-height: 1.5; padding-bottom: 16px;">
              Nous vous confirmons que nous avons bien reçu votre message. Notre équipe l'examinera avec attention et vous répondra dans les plus brefs délais si nécessaire.
            </td>
          </tr>
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 24px;">
              Merci pour votre confiance.
            </td>
          </tr>
  
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${url}" style="background-color: #a42223; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Visiter notre site</a>
            </td>
          </tr>
  
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 4px;">
              Cordialement,
            </td>
          </tr>
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 16px;">
              L'équipe BurningHeart
            </td>
          </tr>
  
          <tr>
            <td>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            </td>
          </tr>
  
          <tr>
            <td align="center" style="padding: 10px 0;">
              <a href="https://facebook.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="vertical-align: middle;">
              </a>
              <a href="https://instagram.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" style="vertical-align: middle;">
              </a>
              <a href="https://youtube.com/@burningheart-bhis" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" alt="LinkedIn" style="vertical-align: middle;">
              </a>
            </td>
          </tr>
  
          <tr>
            <td align="center" style="color: #999999; font-size: 12px; padding-top: 20px;">
              &copy; ${currentYear} – Tous droits réservés
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};

export const newsletterEmailTemplate = (nom, sujet, contenuHtml, unsubscribeUrl) => {
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; padding: 40px 1rem;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
          
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="https://burningheart.netlify.app/img/NavLogo.png" alt="Logo" style="max-width: 100%; width: auto; height: 5rem;">
            </td>
          </tr>
  
          <tr>
            <td align="center" style="color: #a42223; font-size: 24px; font-weight: bold; padding-bottom: 16px;">
              ${sujet}
            </td>
          </tr>
  
          <tr>
            <td style="color: #333333; font-size: 16px; padding-bottom: 16px;">
              Bonjour ${nom},
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; line-height: 1.6; padding-bottom: 24px;">
              ${contenuHtml}
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 24px;">
              Merci de nous lire.<br>
              Si vous ne souhaitez plus recevoir nos newsletters, vous pouvez vous <a href="${unsubscribeUrl}" style="color: #a42223; font-weight: bold;">désabonner</a>.
            </td>
          </tr>
  
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 16px;">
              Cordialement,<br>
              L'équipe BurningHeart
            </td>
          </tr>
  
          <tr>
            <td>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            </td>
          </tr>
  
          <tr>
            <td align="center" style="padding: 10px 0;">
              <a href="https://facebook.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="vertical-align: middle;">
              </a>
              <a href="https://instagram.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" style="vertical-align: middle;">
              </a>
              <a href="https://youtube.com/@burningheart-bhis" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" alt="LinkedIn" style="vertical-align: middle;">
              </a>
            </td>
          </tr>
  
          <tr>
            <td align="center" style="color: #999999; font-size: 12px; padding-top: 20px;">
              &copy; ${currentYear} – Tous droits réservés
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};


export const newsletterSubscriptionConfirmationTemplate = (nom, url) => {
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; padding: 40px 1rem;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
          
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="https://burningheart.netlify.app/img/NavLogo.png" alt="Logo" style="max-width: 100%; width: auto; height: 5rem;">
            </td>
          </tr>

          <tr>
            <td align="center" style="color: #a42223; font-size: 24px; font-weight: bold; padding-bottom: 16px;">
              Abonnement Confirmé !
            </td>
          </tr>

          <tr>
            <td style="color: #333333; font-size: 16px; padding-bottom: 16px;">
              Bonjour ${nom},
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; line-height: 1.5; padding-bottom: 16px;">
              Merci de vous être abonné(e) à notre newsletter ! Vous recevrez désormais nos dernières actualités, conseils, et offres directement dans votre boîte mail.
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 24px;">
              Nous sommes ravis de vous compter parmi nos abonnés.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${url}" style="background-color: #a42223; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Découvrir nos articles</a>
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 4px;">
              À bientôt,
            </td>
          </tr>
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 16px;">
              L'équipe BurningHeart
            </td>
          </tr>

          <tr>
            <td>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px 0;">
              <a href="https://facebook.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="vertical-align: middle;">
              </a>
              <a href="https://instagram.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" style="vertical-align: middle;">
              </a>
              <a href="https://youtube.com/@burningheart-bhis" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" alt="LinkedIn" style="vertical-align: middle;">
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="color: #999999; font-size: 12px; padding-top: 20px;">
              &copy; ${currentYear} – Tous droits réservés
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};

export const eventRegistrationConfirmationTemplate = (nom, nomEvenement, dateEvenement, lieuEvenement, url) => {
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f9f9; padding: 40px 1rem;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-family: Arial, sans-serif;">
          
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="https://burningheart.netlify.app/img/NavLogo.png" alt="Logo" style="max-width: 100%; width: auto; height: 5rem;">
            </td>
          </tr>

          <tr>
            <td align="center" style="color: #a42223; font-size: 24px; font-weight: bold; padding-bottom: 16px;">
              Inscription Confirmée !
            </td>
          </tr>

          <tr>
            <td style="color: #333333; font-size: 16px; padding-bottom: 16px;">
              Bonjour ${nom},
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; line-height: 1.5; padding-bottom: 16px;">
              Votre inscription à l'événement <strong>${nomEvenement}</strong> a été confirmée avec succès.
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 24px;">
              <strong>Détails de l'événement :</strong><br>
              📅 <strong>Date :</strong> ${dateEvenement}<br>
              📍 <strong>Lieu :</strong> ${lieuEvenement}
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 24px;">
              Nous avons hâte de vous voir à cet événement !
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${url}" style="background-color: #a42223; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Voir l'événement</a>
            </td>
          </tr>

          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 4px;">
              À bientôt,
            </td>
          </tr>
          <tr>
            <td style="color: #555555; font-size: 15px; padding-bottom: 16px;">
              L'équipe BurningHeart
            </td>
          </tr>

          <tr>
            <td>
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 10px 0;">
              <a href="https://facebook.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="vertical-align: middle;">
              </a>
              <a href="https://instagram.com/burningheart87" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" style="vertical-align: middle;">
              </a>
              <a href="https://youtube.com/@burningheart-bhis" style="margin: 0 8px;">
                <img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" alt="LinkedIn" style="vertical-align: middle;">
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="color: #999999; font-size: 12px; padding-top: 20px;">
              &copy; ${currentYear} – Tous droits réservés
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};