export const logoutFromContext = (): void => {
  localStorage.removeItem('customer-token');
  localStorage.removeItem('refresh-token');
  localStorage.removeItem('promo-code-name');
  localStorage.removeItem('anonymous-token');
  window.location.reload();
};