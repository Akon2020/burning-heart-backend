export const loginUtilisateur = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: "Email et mot de passe sont requis",
      });
    }

    const utilisateur = await Utilisateur.findOne({
      where: { email },
    });

    if (!utilisateur) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        idUtilisateur: utilisateur.idUtilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const utilisateurSansMotDePasse = {
      idUtilisateur: utilisateur.idUtilisateur,
      nomComplet: utilisateur.nomComplet,
      email: utilisateur.email,
      role: utilisateur.role,
      avatar: utilisateur.avatar,
      dateInscription: utilisateur.dateInscription,
    };

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      utilisateur: utilisateurSansMotDePasse,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
    next(error);
  }
};
