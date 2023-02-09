import "../Style/Footer.css";

function Footer() {
  return (
    <div className="Footer">
      <p>@2022 All Rights Reserved.</p>
      <div className="socialMediaBox">
        <p className="facebook"></p>
        <p className="twitter"></p>
        <p className="linkedin"></p>
      </div>
      <div className="helpBox">
        <a href="#">Contact Us</a>
        <a href="#">Privacy Policies</a>
        <a href="#">Help</a>
      </div>
    </div>
  );
}

export default Footer;
