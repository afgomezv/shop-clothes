import NextLink from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
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
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  console.log({ order });

  const { _id, isPaid, numberOfItems, shippingAddress, orderItems } = order;
  const { firstName, lastName, country, address, address2, city, phone, zip } =
    shippingAddress;

  return (
    <ShopLayout
      title="Resumen de la orden 123671523"
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Order: {_id}
      </Typography>
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
                {isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="Order Pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <h1>Pagar</h1>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
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
