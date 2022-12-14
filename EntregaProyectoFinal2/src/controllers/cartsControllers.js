import {carritosDao} from '../../src/daos/carritos/index.js'

// Borrado de carrito completo
const deleteCart = async(req, res)=>{
    const ID = req.params.id
    try {
      const emptyCart = await carritosDao.emptyCart(ID)
      emptyCart === true
       ? res.json({status: `200 OK`, desc: `El carrito se vacio con exito`}) 
       : res.json({error: `404 Not Found`, desc: emptyCart})
    } catch (error) {
      console.error(error)
    }
  }

  // Sirve para borrar 1 producto del carrito
  const deleteProductFromCart = async (req, res) => {
    const ID = req.params.id;
    const ID_PRODUCT = req.params.id_prod
    try {
      const cartProducts = await carritosDao.deleteProductFromCart(ID, ID_PRODUCT);
      cartProducts === true ? res.json({status: `200 OK`, desc: `Producto eliminado con exito`}) : res.json({error: `404 Not Found`, desc: cartProducts});
    } catch (error) {
      console.error(error);
    }
  }

  // Obtiene los datos de un carrito de compras
  const getCartProducts = async (req, res) => {
    const ID = req.params.id;
    try {
      const cartProducts = await carritosDao.getCartProducts(ID);
      cartProducts ? res.json(cartProducts) : res.json({error: `404 Not Found`, desc: `Lo sentimos! No encontramos el carrito solicitado`});
    } catch (error) {
      console.error(error);
    }
  }

  //crea un nuevo carrito de compras
const postNewCart = async (req, res) => {
const newCart = await carritosDao.addNewCart();
    res.json(`Carrito id: ${newCart} creado con exito`);
  }

  // Añade un producto nuevo al carrito de compras
  const postProductToCart = async (req, res) => {
    const ID = req.params.id;
    const ID_PRODUCT = req.body.id_prod;
    const newCart = await carritosDao.addToCart(ID, ID_PRODUCT);
    if (newCart === true) res.json({ status: `200 OK`, desc: `Producto añandido con exito a su carrito.` });
    else {
      res.json({ error: '404 Not Found', desc: newCart });
    }
  };
  
  export { deleteProductFromCart, deleteCart, postNewCart, postProductToCart, getCartProducts }