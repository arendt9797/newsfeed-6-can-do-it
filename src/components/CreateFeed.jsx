import Logo from '../../public/doitLogo.png';
import '../styles/testCreateFeedStyle.css';
const CreateFeed = () => {
  return (
    <div className="whole-container">
      <section className="menu-bar-container">
        <img src={Logo} />
      </section>
      <div className="container">
        <div className="toast-image-editor"></div>
        <div className="feed-content">
          <input type="text" className="titleInput" />
          <input type="text" className="contextInput" />
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
