import { GetServerSideProps, NextPage } from "next";
import { CartList, OrderSummary } from "@/components/cart";
import { AdminLayout, ShopLayout } from "@/components/layouts";
import {
  AirplaneTicketOutlined,
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
  Typography,
} from "@mui/material";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems } = order;
  const { firstName, lastName, country, address, address2, city, phone, zip } =
    shippingAddress;

  return (
    <AdminLayout
      title="Resumen de la orden"
      subTitle={`OrderId: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
    >
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Order Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de Pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems}{" "}
                {numberOfItems > 1 ? "productos" : "producto"})
              </Typography>

              <Divider sx={{ my: 1 }}></Divider>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección Entrega</Typography>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 ? address2 : ""}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }}></Divider>

              <Box display="flex" justifyContent="end"></Box>

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  total: order.total,
                  tax: order.tax,
                }}
              />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {/*TODO: */}

                <Box display="flex" flexDirection="column">
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="Order Pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="Pendiente de Pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/admin/orders",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
