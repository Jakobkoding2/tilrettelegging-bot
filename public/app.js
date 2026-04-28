class DemoApp {
  constructor() {
    this.files = [];
    this.fileInput = document.getElementById('fileInput');
    this.pickBtn = document.getElementById('pickBtn');
    this.dropzone = document.getElementById('dropzone');
    this.init();
  }
  init() {
    this.pickBtn.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', e => this.addFiles(e.target.files));
    this.dropzone.addEventListener('dragover', e => { e.preventDefault(); this.dropzone.classList.add('drag'); });
    this.dropzone.addEventListener('dragleave', e => { e.preventDefault(); this.dropzone.classList.remove('drag'); });
    this.dropzone.addEventListener('drop', e => { e.preventDefault(); this.dropzone.classList.remove('drag'); this.addFiles(e.dataTransfer.files); });
  }
  addFiles(fileList) {
    this.files.push(...Array.from(fileList || []));
  }
}
document.addEventListener('DOMContentLoaded', () => new DemoApp());
