//import { GetServerSideProps } from "next";
//import { isValidaToken } from "../../utils/jwt";
import { useContext } from "react";
import { ShopLayout } from "@/components/layouts";
import { CartContext } from "@/context";
import { countries } from "@/utils/countries";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get("firstName") || "",
    lastName: Cookies.get("lastName") || "",
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    zip: Cookies.get("zip") || "",
    city: Cookies.get("city") || "",
    country: Cookies.get("country") || "",
    phone: Cookies.get("phone") || "",
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const onSubmitAddress = (data: FormData) => {
    updateAddress(data);
    router.push("/checkout/summary");
  };

  return (
    <ShopLayout
      title="Direction"
      pageDescription="Confirmar direccion del destino"
    >
      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <Typography variant="h1" component="h1">
          Dirección
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "Este es requerido",
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "Este es requerido",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "Este es requerido",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (Opcional)"
              variant="filled"
              fullWidth
              {...register("address2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              {...register("zip", {
                required: "Este es requerido",
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "Este es requerido",
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="País"
                defaultValue={Cookies.get("country") || countries[0].code}
                //value={"COL"}
                {...register("country", {
                  required: "Este es requerido",
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "Este es requerido",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

//* You should use getServerSideProps when:
//* - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = "" } = req.cookies;
//   let userId = "";
//   let isValidaToken = false;

//   try {
//     userId = await jwt.isValidaToken(token);
//     isValidaToken = true;
//   } catch (error) {
//     isValidaToken = false;
//   }

//   if (!isValidaToken) {
//     return {
//       redirect: {
//         destination: "/auth/login?p=/checkout/address",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// };

export default AddressPage;
