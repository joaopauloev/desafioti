import styled from "styled-components";

export const ProfileBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  font-family: "Poppins", sans-serif;
  height: 100%;
  width: 100%;
  .avatar {
    border-radius: 50%;
    height: 75px;
    width: 75px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  justify-content: flex-start;
  align-items: flex-start;
  .ant-btn {
    padding: 0px;
    color: #590082;
    text-decoration: underline  !important;
  }
`;
