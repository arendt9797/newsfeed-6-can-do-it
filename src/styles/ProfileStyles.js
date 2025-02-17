import styled from 'styled-components';

export const StMyProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 100px;
  margin-top: 50px;
  position: relative;
  overflow: auto;

`;

export const StMyProfileContainer = styled.div`
  width: 900px;
  height: 1000px;
  border: 3px solid #d1d1d1;
  border-radius: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 10px;

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'image info' 'image categories';
    height: 800px;
    
  }

  .user-image {
    grid-area: image;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 150px;
  }

  .logo-img {
    width: 130px;
    border-radius: 20px;
    margin-bottom: 50px;
  }

  .file-wrapper > input {
    display: none;
  }

  .file-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    padding: 5px;
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    width: 300px;
    height: 40px;
  }

  .preview-img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #d1d1d1;
    cursor: pointer;
  }

  .default-img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 2px solid #d1d1d1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
    font-style: italic;
    font-weight: bold;
    color: #21212e;
    background-color: #46d7ab;
  }

  .user-info {
    grid-area: info;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    min-height: 600px;
    margin-top: 50px;
    padding-right: 20px;
  }

  .user-info div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    min-height: 95px;
    margin-bottom: 10px;
  }

  .user-info input {
    font-size: 16px;
    height: 50px;
    width: 100%;
    max-width: 400px;
    border: none;
    border-bottom: 3px solid #21212e;
    outline: none;
    transition: border-bottom 0.4s ease-in-out;

    &:focus {
      border-bottom: 3px solid #46d7ab;
    }
  }

  .user-info p {
    height: 20px;
    font-weight: bold;
  }

  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    display: block;
    min-height: 18px;
  }

  .categories {
    grid-area: categories;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    max-width: 400px;
    align-self: start;
    margin-top: 30px;
  }

  .categories > p {
    font-size: large;
    font-weight: bold;
    margin-bottom: 10px;
    width: 100%;
    flex-basis: 100%;
  }
`;

export const StCategoryButton = styled.button`
  width: auto;
  min-width: 80px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#0d8b67' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  font-size: medium;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#13ad82' : '#c6eee2')};
  }
`;

export const StSubmitButton = styled.button`
  grid-column: 1 / -1; 
  justify-self: center; 
  margin-top: 50px;
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #46d7ab;
  color: #21212e;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #46e4b5;
  }
`;