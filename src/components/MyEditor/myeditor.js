import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageResizeEditing from '@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting'
import ImageResizeHandles from '@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'

import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Upload from '@ckeditor/ckeditor5-upload/src/filerepository'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
// import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js'

export default class ClassicEditor extends ClassicEditorBase {
}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
    Essentials,
    UploadAdapter,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    Underline,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResizeEditing,
    ImageResizeHandles,
    Indent,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,

    FontBackgroundColor,
    FontSize,
    FontColor,
    Alignment,
    Upload,
    RemoveFormat
]

// Editor configuration.
ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            'bold',
            'italic',
            'underline',
            'link',
            'bulletedList',
            'numberedList',
            'removeFormat',
            '|',
            'alignment:left',
            'alignment:center',
            'alignment:right',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
        ],
        shouldNotGroupWhenFull: true
    },
    fontSize: {
        options: ['12', '14', '16', '18', '20', '22', '26', '30', '36', '42']
    },
    image: {
        toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            'imageStyle:inline',
            'imageStyle:block',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            'linkImage'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    mediaEmbed: {
        providers: [
            {
                name: 'myprovider',
                url: [
                    /^lizzy.*\.com.*\/media\/(\w+)/,
                    /^www\.lizzy.*/,
                    /^.*/
                ],
                html: match => {
                    //获取媒体url
                    const input = match['input']
                    //console.log('input' + match['input']);
                    // return (
                    //     '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 70%;">' +
                    //     `<iframe src="https://${input}" ` +
                    //     'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    //     'frameborder="0" allowtransparency="true" allow="encrypted-media">' +
                    //     '</iframe>' +
                    //     '</div>'
                    // )
                    return `<video src="${input}" controls controlsList="nodownload noremoteplayback" playsinline webkit-playsinline disablePictureInPicture oncontextmenu="return false" style="max-width: 100%;"></video>`
                }
            }
        ],
        previewsInData: `<video src=* controls controlsList="nodownload noremoteplayback" playsinline webkit-playsinline disablePictureInPicture oncontextmenu="return false" style="max-width: 100%;"></video>`
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    // language: 'zh-cn'
}
