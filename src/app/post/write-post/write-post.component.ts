import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { flyIn } from '../../animations/fly-in';
import { Post } from '../model/post-model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { WritePostService } from './write-post.service';

@Component({
  selector: 'app-write-post',
  templateUrl: './write-post.component.html',
  styleUrls: ['./write-post.component.scss'],
  animations: [
    flyIn
  ]
})

export class WritePostComponent implements OnInit,AfterViewInit,OnDestroy {
    private headers = new Headers({'Content-Type': 'application/json'});

    private writePostURL:string="/post/newPost";

	  public editor;

    public post:Post = new Post();

  	constructor(
        public router: Router,
        public activeRoute: ActivatedRoute,
        public toastr: ToastsManager,
        public vcr: ViewContainerRef,
        public writePostService:WritePostService
    ){ 
      this.toastr.setRootViewContainerRef(vcr);
    }

	  ngOnInit() {
  	
    }

  	ngAfterViewInit() {
        /**
         *  【非常重要】
         *  关于TinyMCE的完整文档，请查看这里https://www.tinymce.com/docs/
         */
    	  tinymce.init({
      		  selector: '#post_editor',
            skin_url: '/assets/skins/lightgray',
            //menubar:false,
      		  plugins: [
              'advlist autolink lists link image charmap print preview hr anchor pagebreak',
              'searchreplace wordcount visualblocks visualchars code fullscreen',
              'insertdatetime media nonbreaking save table contextmenu directionality',
              'emoticons template paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
            image_advtab: true,
            codesample_content_css:'/assets/css/prism.css',
            //文件和图片上传相关的选项
            file_browser_callback_types: 'image',
            file_browser_callback: function(field_name, url, type, win) {
              console.log(type);
              console.log(type=='image');
              if(type=='image'){
                  let event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                  });
                  let fileInput = document.getElementById('img_input');
                  fileInput.dispatchEvent(event);
              } 
            },
            setup: editor => {
          		this.editor = editor;
              this.editor.on('keyup', () => {
                  let content = editor.getContent();
                  console.log(content);
              });
      		  }
    	    });
  	}

  	public ngOnDestroy() {
    	tinymce.remove(this.editor);
  	}

    public submitPost(){
      console.log(this.editor.getContent());
      let content=this.editor.getContent();
      this.post.content=content;
      this.writePostService.newPost(this.post).subscribe(
          res=>{
            if(res&&res.success){
              this.router.navigateByUrl("posts/page/1");
            }else{
              this.toastr.error(res.msg,"系统提示");
            }
          },
          error=>{},
          ()=>{}
      );
    }
}
