import { createSlice } from '@reduxjs/toolkit';

export const productoSlice = createSlice({
    name: 'producto',
    initialState: {
        productosCargando: true,
        productos: [],
        productoActivo: null,
        productoAccion: false,
        modalAdd: false,
        modalEdit: false,
    },
    reducers: {
        onSetActiveProducto: (state, { payload }) => {
            state.productoActivo = payload;
            state.modalAdd = true;
        },
        onSetDesactiveProducto: (state) => {
            state.productoActivo = null;
            state.modalAdd = false
        },
        onSetActiveProductoEdit: (state, { payload }) => {
            state.productoActivo = payload;
            state.modalEdit = true;
        },
        onSetDesactiveProductoEdit: (state) => {
            state.productoActivo = null;
            state.modalEdit = false
        },
        onAddNewProducto: (state, { payload }) => {
            state.productos.push(payload);
            state.modalAdd = false;
            state.productoActivo = null;
        },
        onUpdateProducto: (state, { payload }) => {
            state.productos = state.productos.map(producto => {
                if (producto.id === payload.id) {
                    return payload;
                }

                return producto;
            });

        },
        onUpdateRCP: (state, { payload }) => {
            state.productos = state.productos.map(producto => {
                if (producto.id_Pro === payload.id_Pro) {

                    let xtock = parseFloat(producto.stock_Actual) + parseFloat(payload.cantidad);
                    let xpreventa = parseFloat(producto.frank) * parseFloat(payload.pre_CompraS);
                    let xutilidad = parseFloat(xpreventa) - parseFloat(payload.pre_CompraS);
                    let xvalorAlmacen = parseFloat(payload.cantidad) * parseFloat(payload.pre_CompraS);

                    return {
                        ...producto,
                        stock_Actual: xtock,
                        pre_CompraS: parseFloat(payload.pre_CompraS.toFixed(2)),
                        pre_vntaxMenor: parseFloat(xpreventa.toFixed(2)),
                        utilidadUnit: parseFloat(xutilidad.toFixed(2)),
                        valor_porCant: parseFloat(xvalorAlmacen.toFixed(2)),
                    }
                }

                return producto;
            });
        },
        onDeleteProducto: (state) => {
            if (state.productoActivo) {
                console.log(state.productoActivo.id);
                state.productos = state.productos.filter(producto => producto.id !== state.productoActivo.id);
                state.productoActivo = null;
            }
        },
        onLoadProductos: (state, { payload = [] }) => {
            payload.forEach(producto => {
                const exists = state.productos.some(dbProducto => dbProducto.id === producto.id);
                if (!exists) {
                    state.productos.push(producto);
                }
            });
            state.productosCargando = false;
        },
        onLogoutProductos: (state) => {
            state.productosCargando = true;
            state.productos = [];
            state.productoActivo = null;
            state.productoAccion = false;
            state.modalAdd = false;
            state.modalEdit = false;
        },
    },
});

export const {
    onAddNewProducto,
    onDeleteProducto,
    onLoadProductos,
    onLogoutProductos,
    onSetActiveProducto,
    onSetActiveProductoEdit,
    onSetDesactiveProducto,
    onSetDesactiveProductoEdit,
    onUpdateProducto,
    onUpdateRCP,
} = productoSlice.actions;
