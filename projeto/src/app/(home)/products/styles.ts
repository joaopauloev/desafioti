import styled from "styled-components";

export const ProductMainBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  padding-right: 15px;
  gap: 15px;
  font-family: "Poppins", sans-serif;
  .ant-input {
    width: 200px !important;
  }

`;

export const ProductGrid = styled.div`
  display: grid;
  flex-direction: column;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
`;

export const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  color: #590082;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
`;

export const ActionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
`;
