const logout = (req, res) => {
    res.clearCookie("userRegistered");
    res.redirect("/");
  };
  
  export default logout;  