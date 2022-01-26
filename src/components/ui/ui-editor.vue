<template>
  <div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" @ready="onReady"></ckeditor>
  </div>
</template>

<script>
// import ClassicEditor from '../../components/MyEditor/myeditor';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import CKEditor from '@ckeditor/ckeditor5-vue';
import UploadAdapter from "../../utils/UploadAdapter";

export default {
  name: "ui-editor",
  props: {
    modelValue: String,
  },
  components: {
    ckeditor: CKEditor.component,
  },
  computed: {
    editorData: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit("update:modelValue", val)
      }
    }
  },
  data() {
    return {
      content: '',
      editor: DecoupledEditor,
      editorConfig: {}
    }
  },
  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      )
      // 自定义上传图片插件
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
      }
    },
  }
}
</script>
