export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateNickname = (nickname) => {
  const nicknameRegex = /^[a-zA-Z]{2,8}$|^[가-힣]{2,8}$|^[a-zA-Z가-힣]{2,8}$/;
  return nicknameRegex.test(nickname);
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

export const validateGithub = (github) => {
  if (!github) return true;
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+$/;
  return githubRegex.test(github);
};

export const validateBlog = (blog) => {
  if (!blog) return true;
  const blogRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([/\w@.-]*)*\/?$/;
  return blogRegex.test(blog);
};


