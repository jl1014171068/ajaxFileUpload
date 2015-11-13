# ajaxFileUpload
A javascript library use XMLHttpRequest to submit form with file without use jQuery OR Zepto

## how to use

```js
new AjaxSubmitForm(document.getElementById('form'), 'url', {
  method: AjaxSubmitForm.POST,
  enctype: AjaxSubmitForm.FORM_DATA,
  type: AjaxSubmitForm.JSON,
  extraData: [],
  timeout: 30,
  onUploadProgress: null,
  onUploadLoadStart: null,
  onUploadLoadEnd: null,
  onUploadLoad: null,
  onUploadAbort: null,
  onUploadError: null,
  onUploadTimeout: null,
  onProgress: null,
  onLoadStart: null,
  onLoadEnd: null,
  onLoad: null,
  onAbort: null,
  onError: null,
  onTimeout: null,
  success: null,
  error: null,
  complete: null
}).send();
```
