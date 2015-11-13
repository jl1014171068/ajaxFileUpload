# ajaxFileUpload
A javascript library use XMLHttpRequest to submit form with file without use jQuery OR Zepto

## how to use

```js
new AjaxSubmit(document.getElementById('form'), 'url', {
  method: AjaxSubmit.POST,          // request method: POST/GET/PUT/DELETE/OPTIONS/PATCH/HEAD/TRACE, default is POST
  enctype: AjaxSubmit.FORM_DATA,    // upload data enctype type: FORM_DATA/JSON/URL_ENCODED/BLOB, default is FORM_DATA
  type: AjaxSubmit.JSON,            // response type: JSON/XML/TEXT, default is JSON
  extraData: [],                    // the other data to upload
  timeout: 30,                      // timeout, default is 30
  onUploadProgress: null,           // on upload progress callback, e.total is the size and e.loaded is uploaded
  onUploadLoadStart: null,          // upload start callback
  onUploadLoadEnd: null,            // upload end callback
  onUploadLoad: null,               // upload callback
  onUploadAbort: null,              // upload abort callback
  onUploadError: null,              // upload error callback
  onUploadTimeout: null,            // upload timeout callback
  onProgress: null,                 // download progress callback
  onLoadStart: null,                // download start callback
  onLoadEnd: null,                  // download end callback
  onLoad: null,                     // download callback
  onAbort: null,                    // abort callback
  onError: null,                    // error callback
  onTimeout: null,                  // timeout callback
  success: null,                    // success callback, readyState === 4 && xhr.status < 300
  error: null,                      // error callback, readyState === 4 && xhr.status > 299
  complete: null,                   // complete callback, readyState === 4
  context: window                   // the success/error/complete callback context
}).send();                          // send request
```

## example

the form in html as follow:

```html
<form id="form">
    <input type="file" name="file" id="file">
    <input type="file" multiple name="files[]" id="files">
    <input type="text" name="text">
    <input type="radio" name="radio" value="1">
    <input type="radio" name="radio" value="2">
    <select name="select">
        <option value="1">1</option>
        <option value="2">2</option>
    </select>
</form>
<div id="result"></div>
```

1. submit all form fields

```js
var $result = $('#result');
new AjaxSubmit('form', '', {
    method: AjaxSubmit.POST,    // only post and put has body, so if upload file, method can only be post or put
    enctype: AjaxSubmit.FORM_DATA,  // with multiple field upload
                                    // if has file fields, only FORM_DATA can be used
                                    // else can also be JSON or URL_ENCODED
    type: AjaxSubmit.JSON,      // response type, JSON is default
    onUploadLoadStart: function() {
        $result.html('uplaod 0%');
    },
    onUploadProgress: function(e) {
        $result.html('uploading ' + ((e.loaded/e.total*100).toFixed(2)) + '%');
    },
    onUploadLoadEnd: function() {
        $result.html('upload 100%');
    },
    onLoadStart: function() {
        $result.html('download 0%');
    },
    onProgress: function(e) {
        $result.html('donwloading ' + ((e.loaded/e.total*100%).toFixed(2)) + '%');
    },
    onLoadEnd: function() {
        $result.html('download 100%');
    },
    success: function(data) {
        $result.html(JSON.stringify(data, null, '    '));
    }
}).send();
```

2. submit one field

```js
new AjaxSubmit('file', '', {
    enctype: AjaxSubmit.BLOB    // for one field upload
                                // blob only upload the field value, if is file, upload file[0] || null
                                // FORM_DATA upload as name => value, if is file, and name === 'xxx[]' and multiple is true
                                //      upload all files as xxx[0] => file[0], xxx[1] => file[1]
                                // JSON/URL_ENCODED will not upload file field
}).send();
```

3. with jQuery or Zepto

```js
$('#form').ajaxSubmit('url', {
    enctype: AjaxSubmit.FORM_DATA
    // ...
})
```

4. fast call

```js
new AjaxSubmit('formOrFieldIdOrElement', 'requestUrl', function(successCallback) {}, "responseType").send();
```
