/* eslint-disable react/prop-types */

import { handleImageChange } from "../../shared/utils/fileUtils";

function ProfileImageUploader({ preview, setImage, setPreview }) {
  return (
    <div className="user-image">
      <img className="logo-img" src="/team_logo.png" alt="site_logo" />
      <img
        className="preview-img"
        src={preview || "/team_logo.png"}
        alt="프로필 이미지"
        onClick={() => document.getElementById("file-upload").click()}
      />
      <input
        type="file"
        id="file-upload"
        onChange={(e) => handleImageChange(e, setImage, setPreview)}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default ProfileImageUploader;