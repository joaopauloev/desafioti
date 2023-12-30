import styled from "styled-components";

export const MainBody = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  color: #000;
  font-family: 'Poppins';
  .ant-tabs {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .ant-tabs-nav::before {
    border: none;
  }
  .ant-tabs-ink-bar {
    background-color: #590082;
  }
  .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
    color: #590082 !important;
  }

`;

export const TabBox = styled.div`
  display: flex; 
  align-items:center; 
  justify-content: space-between;
  padding-right: 15px;
  .ant-btn{
    background-color: #590082;
    color:#fff;
    font-weight: 700;
  }
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  font-weight: 800;
  background-color: #590082;
  height: 60px;
  color: #fff;
  font-family: "Poppins", sans-serif;
`;
