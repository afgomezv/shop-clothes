import NextLink from "next/link";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de la orden 123671523"
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Order: 123671523
      </Typography>
      {/* <Chip
        sx={{ my: 2 }}
        label="Pendiente de Pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}
      <Chip
        sx={{ my: 2 }}
        label="Order Pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen (3 productos)</Typography>

              <Divider sx={{ my: 1 }}></Divider>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección Entrega</Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>Fernando Herrera</Typography>
              <Typography>Car 51B # 88 - 68</Typography>
              <Typography>Medellin - Aranjuez</Typography>
              <Typography>Colombia</Typography>
              <Typography>+057 3502076277</Typography>

              <Divider sx={{ my: 1 }}></Divider>

              <Box display="flex" justifyContent="end">
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                {/*TODO: */}
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Order Pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
