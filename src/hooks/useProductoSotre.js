import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { eventsAlert, progressBar, savedAlert } from '../alerts';
import { andersonApi } from '../api';
import { onAddNewProducto, onDeleteProducto, onLoadProductos, onSetActiveProducto, onSetActiveProductoEdit, onSetDesactiveProducto, onSetDesactiveProductoEdit, onUpdateProducto } from '../store';

export const useProductoSotre = () => {

    const dispatch = useDispatch();

    const { productos, productoActivo, modalAdd, modalEdit, productosCargando } = useSelector(state => state.producto);
    const { user } = useSelector(state => state.auth);

    const setActiveProducto = (producto) => {
        dispatch(onSetActiveProducto(producto));
    }

    const setDesactiveProducto = () => {
        dispatch(onSetDesactiveProducto());
    }

    const setActiveProductoEdit = (producto) => {
        dispatch(onSetActiveProductoEdit(producto));
    }

    const setDesactiveProductoEdit = () => {
        dispatch(onSetDesactiveProductoEdit());
    }

    const startSavingProducto = async (producto) => {
        try {

            progressBar('Guardando...');
            //TODO: llegar al backend
            const { data } = await andersonApi.post('/producto', producto);
            //todo bien
            Swal.close();
            dispatch(onAddNewProducto({ ...producto, id: data.productoGuardado.id, user: { name: user.name } }));
            savedAlert(`El proveedor ${producto.nombre}, ha sido guardado.`);
        } catch (error) {
            Swal.close();
            eventsAlert('', 'Ocurrió un error al momento de guardar', 'error');
        }
    }

    const startUpdateProducto = async (producto) => {
        try {
            progressBar('Actualizando...');
            const { data } = await andersonApi.put('/producto', producto);
            dispatch(onUpdateProducto({ ...producto, id: data.producto.id, user: { name: user.name } }));
            dispatch(onSetDesactiveProductoEdit());
            eventsAlert('', 'Producto actualizado', 'success');
        } catch (error) {
            Swal.close();
            eventsAlert('', 'Ocurrió un error al momento de actualizar', 'error');
        }
    }

    const startDeletingProducto = async () => {
        try {
            progressBar('Eliminando...');
            await andersonApi.delete(`/producto/${productoActivo.id}`);
            dispatch(onDeleteProducto());
            dispatch(onSetDesactiveProductoEdit());
            eventsAlert('', 'Producto eliminado', 'success');

        } catch (error) {
            Swal.close();
            eventsAlert('', 'Ocurrió un error al momento de actualizar', 'error');
        }
    }

    const startLoadingProductos = async () => {
        try {
            const { data } = await andersonApi.get('/producto');
            dispatch(onLoadProductos(data.productos));
        } catch (error) { }
    }

    return {
        //* Propiedades
        modalAdd,
        modalEdit,
        productoActivo,
        productos,
        productosCargando,

        //* Metodos
        setActiveProducto,
        setActiveProductoEdit,
        setDesactiveProducto,
        setDesactiveProductoEdit,
        startDeletingProducto,
        startLoadingProductos,
        startSavingProducto,
        startUpdateProducto,
    }
}
