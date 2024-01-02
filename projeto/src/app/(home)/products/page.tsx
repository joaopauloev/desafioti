/* eslint-disable @next/next/no-img-element */
/* Products Page  */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Modal,
  Form,
  message,
  Upload,
  Button,
  UploadProps,
  Checkbox,
} from "antd";
import * as S from "./styles";
import { useModal } from "../layout";
import { getAccessToken } from "../../utils/tokenManager";
import { Product } from "@/app/interfaces/product";
import { useProducts } from "@/app/utils/productContex";
import { DeleteOutlined, EditOutlined, InboxOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

interface ProductFormData {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

interface ProductEditFormData {
  title: string;
  price: number;
}

interface Filter {
  id: number;
  name: string;
}

interface FilterValues {
  [key: string]: string;
}

const ProductsPage = () => {
  const [productForm] = Form.useForm();
  const [editProductform] = Form.useForm();
  const { products, fetchProducts, allProducts, setProducts } = useProducts();

  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const productsPerPage = 21;
  const [filters] = useState<Filter[]>([
    { id: 1, name: "title" },
    { id: 2, name: "price" },
    { id: 3, name: "description" },
    { id: 4, name: "category" },
  ]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [toBeEdited, setToBeEdited] = useState<Product>({
    id: 0,
    title: "",
    price: 0,
    description: "",
    category: {
      id: 0,
      name: "",
      image: "",
    },
    images: [""],
  });

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const nextPage = () => {
    setCurrentPage((current) => current + 1);
  };

  const prevPage = () => {
    setCurrentPage((current) => current - 1);
  };

  useEffect(() => {
    fetchProducts(currentPage, productsPerPage);
  }, [currentPage, fetchProducts]);

  const modalContext = useModal();
  if (!modalContext) {
    return null;
  }

  const { isProductModalVisible, showProductModal, handleProductCancel } =
    modalContext;

  const handleSearchWithFilters = async () => {
    let apiUrl = "https://api.escuelajs.co/api/v1/products?";
    const filterParams = Object.entries(filterValues)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    apiUrl += filterParams;

    try {
      const response = await axios.get(apiUrl);
      setProducts(response.data); // atualize o estado dos produtos
    } catch (error) {
      console.error("Erro ao buscar produtos com filtros:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (!search) {
        return setProducts(allProducts);
      }
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products/${search}`
      );

      setProducts([response.data]);
    } catch (error) {
      console.error("Erro ao buscar o produto:", error);
      message.error("Produto não encontrado.");
    }
  };

  const handleOpenEdit = (product: Product) => {
    setShowEdit(!showEdit);
    setToBeEdited(product);
  };

  const handleCancelEdit = () => {
    setShowEdit(!showEdit);
    setToBeEdited({
      id: 0,
      title: "",
      price: 0,
      description: "",
      category: {
        id: 0,
        name: "",
        image: "",
      },
      images: [""],
    });
  };

  const handleEdit = async (values: ProductEditFormData) => {
    const formattedValues = {
      ...values,
      price: values.price.toString(),
    };

    try {
      const token = getAccessToken();
      await axios.put(
        `https://api.escuelajs.co/api/v1/products/${toBeEdited.id}`,
        formattedValues,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Produto atualizado com sucesso!");
      fetchProducts(currentPage, productsPerPage);
      handleCancelEdit();
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      message.error("Erro ao atualizar o produto.");
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      const token = getAccessToken();
      const response = await axios.delete(
        `https://api.escuelajs.co/api/v1/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        message.success("Produto deletado com sucesso!");
        fetchProducts(currentPage, productsPerPage);
      }
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
      message.error("Erro ao deletar o produto.");
    }
  };

  const handleFormSubmit = async (values: ProductFormData) => {
    const imagesUrls = fileList
      .filter((file) => !!file.response)
      .map((file) => file.response.location);

    const productData: ProductFormData = {
      ...values,
      images: imagesUrls,
    };

    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (response.data) {
        message.success("Produto criado com sucesso!");
        productForm.resetFields();
        setFileList([]);
        handleProductCancel();
        fetchProducts(currentPage, productsPerPage);
        handleProductCancel;
      }
    } catch (error) {
      message.error("Erro ao criar o produto.");
      console.error("Submit error:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://api.escuelajs.co/api/v1/files/upload",
    onChange(info) {
      const newFileList = info.fileList.map((file) => {
        if (file.response && file.response.location) {
          console.log(file.response);
          file.url = file.response.location;
          fileList.push(file.response.location);
        }
        return file;
      });

      setFileList(newFileList);
    },
  };

  const onFilterChange = (checkedValues: CheckboxValueType[]) => {
    const newSelectedFilters = filters.reduce((acc, category) => {
      acc[category.name] = checkedValues.includes(category.name);
      return acc;
    }, {} as { [key: string]: boolean });
    setSelectedFilters(newSelectedFilters);
  };

  const isAnyFilterSelected = Object.values(selectedFilters).some(
    (value) => value
  );

  const handleInputChange = (filterId: string, value: string) => {
    setFilterValues((prevValues) => ({ ...prevValues, [filterId]: value }));
  };

  return (
    <S.ProductMainBody>
      <Modal
        title="Adicionar Novo Produto"
        open={isProductModalVisible}
        onOk={() => productForm.submit()}
        onCancel={handleProductCancel}
      >
        <Form form={productForm} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="title" label="Titulo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Preço" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, type: "string" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="ID da Categoria"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="images" label="Imagens" rules={[{ required: true }]}>
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Editar Produto"
        open={showEdit}
        onOk={() => editProductform.submit()}
        onCancel={handleCancelEdit}
      >
        {" "}
        <Form form={editProductform} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="title"
            label="Titulo"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Preço"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Checkbox.Group
        options={filters.map((filter) => ({
          label: filter.name,
          value: filter.name,
        }))}
        onChange={onFilterChange}
      />
      {filters.map((filter) => {
        if (selectedFilters[filter.name]) {
          if (filter.name !== "price range") {
            return (
              <Input
                placeholder={`Filtrar por ${filter.name}`}
                key={filter.name}
                value={filterValues[filter.name] || ""}
                onChange={(e) => handleInputChange(filter.name, e.target.value)}
                onPressEnter={handleSearchWithFilters}
              />
            );
          }
        }
        return null;
      })}
      {!isAnyFilterSelected && (
        <Input
          placeholder="Busque o produto pelo ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
        />
      )}
      <S.ProductGrid>
        {products.map((product) => {
          return (
            <S.ProductCard key={product.id}>
              <S.TopContainer>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  width={150}
                  height={150}
                />
                <S.ActionBox>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    style={{ color: "#590082" }}
                    onClick={() => handleOpenEdit(product)}
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    style={{ color: "red" }}
                    onClick={() => handleDelete(product.id)}
                  />
                </S.ActionBox>
              </S.TopContainer>
              <strong>{product.title}</strong>
              <span>${product.price}</span>
            </S.ProductCard>
          );
        })}
      </S.ProductGrid>
      <div
        style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}
      >
        <Button onClick={prevPage} disabled={currentPage === 1}>
          {"<"}
        </Button>
        <span style={{ margin: "0 10px" }}>
          {currentPage} / {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage >= totalPages}>
          {">"}
        </Button>
      </div>
    </S.ProductMainBody>
  );
};

export default ProductsPage;
