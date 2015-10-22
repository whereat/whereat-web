const sys = {};

sys.isSafari = () => {
  return navigator.userAgent.toLowerCase().indexOf('safari') !== -1 &&
  (
    navigator.userAgent.toLowerCase().indexOf('chrome') === -1 ||
    navigator.userAgent.toLowerCase().indexOf('mozilla') === -1
  );
};

export default sys;
