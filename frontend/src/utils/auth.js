export const isAdminAuthenticated = () => {
    return !!localStorage.getItem("adminAccessToken");
  };
