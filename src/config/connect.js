const ConnectMe = {
  BASE_URL: "",
  img_URL: "",

  setUrls() {
    const hostname = window.location.hostname;

    if (hostname === "localhost") {
      this.BASE_URL = "http://localhost:3060/v1";
      this.img_URL = "http://localhost:3060";
    } else if (hostname === "intranet.zaptas.in") {
      this.BASE_URL = "https://intranet.zaptas.in/v1";
      this.img_URL = "https://intranet.zaptas.in";
    } else if (hostname === "192.168.3.108") {
      this.BASE_URL = "http://192.168.3.108/v1";
      this.img_URL = "http://192.168.3.108";
    } else {
      console.error("Hostname not recognized. Please configure the URLs.");
    }
  },
};

// Initialize the URLs
ConnectMe.setUrls();

export default ConnectMe;
