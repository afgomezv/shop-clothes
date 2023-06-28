import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

const WomenPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"Teslo-Shop - Mujeres"}
      pageDescription={"Encuentra los mejores productos para mujeres"}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Mujeres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
