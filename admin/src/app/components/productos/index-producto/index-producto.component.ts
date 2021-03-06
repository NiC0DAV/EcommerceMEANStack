import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { global } from 'src/app/service/global';
import { ProductoService } from 'src/app/service/producto.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public loadData: any = true;
  public filtro: any = '';
  public token: any;
  public productos: Array<any> = [];
  public url: string;
  public page = 1;
  public pageSize = 5;
  public loadBtn: boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService
  ) {
    this.token = _adminService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(){
    this._productoService.fetchProductsAdmin(this.filtro, this.token).subscribe(
      response => {
        console.log(response);
        this.productos = response.data;
        this.loadData = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  filterProduct() {
    if (this.filtro) {
      console.log(this.filtro);
      this._productoService.fetchProductsAdmin(this.filtro, this.token).subscribe(
        response => {
          console.log(response);
          this.productos = response.data;
          this.loadData = false;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      iziToast.error({
        title: 'Error realizando registro:',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar'
      });
    }
  }

  resetFilter(){
    this.filtro = '';
    this.initData();
  }

  deleteItem(id){
    this.loadBtn = true;
    this._productoService.deleteClient(id, this.token).subscribe(
      response => {
        iziToast.success({
          title: 'Producto Eliminado:',
          position: 'topRight',
          message: 'El producto fue eliminado exitosamente'//error.message
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadBtn = false;
        this.initData();
      },
      error => {
        iziToast.error({
          title: 'Error:',
          position: 'topRight',
          message: 'Hubo un error eliminando el producto'//error.message
        });
        this.loadBtn = false;
      }
    );
  }

}
