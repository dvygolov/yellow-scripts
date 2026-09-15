/////////////////////////////////////////////////////////////////////////
//comm
////////////////////////////////////////////////////////////////////////////////
class Comment {
	constructor(
		commentForm,
		inputCommentName,
		inputCommentText,
		formImage,
		formAvatar,
		commentPushBlock
	) {
		this.commentForm = document.querySelector(commentForm);
		this.inputCommentName = document.querySelector(inputCommentName);
		this.inputCommentText = document.querySelector(inputCommentText);
		this.formImage = document.querySelector(formImage);
		this.formAvatar = document.querySelector(formAvatar);
		this.commentPushBlock = document.querySelector(commentPushBlock);
		this.commArrAll = [];
		this.formImageUrl;
		this.formImageChange();
		this.pushComBlock();
		this.domOnloader()
	}

	uploadFile(file) {
		if (!file) return;
		// провераяем тип файла
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Solo se permiten imágenes.');
			this.formImage.value = '';
			return;
		}
		// проверим размер файла (<2 Мб) 
		if (file.size > 1 * 1024 * 1024) {
			alert('El archivo debe tener menos de 1 MB.');
			return;
		}
		var reader = new FileReader();
		reader.onload = (e) => {
			this.formAvatar.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
			this.formAvatar.classList.add('form__avatar--loaded');
			this.formImageUrl = e.target.result;
		};
		reader.onerror = function (e) {
			alert('Error');
		};
		reader.readAsDataURL(file);
	}

	formImageChange() {
		this.formImage.addEventListener('change', () => {
			this.uploadFile(this.formImage.files[0]);
		});
	}

	pushComm() { }

	removeInputClass() {
		if (this.inputCommentName) {
			this.inputCommentName.value = '';
			this.inputCommentName.classList.remove('error')
		}
		this.inputCommentText.value = '';
		this.inputCommentText.classList.remove('error')
	}

	pushComBlock() {
		this.commentForm.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.inputCommentName) {
				if (this.inputCommentName.value && this.inputCommentText.value) {
					this.formAvatar.innerHTML = '';
					this.formAvatar.classList.remove('form__avatar--loaded');
					return this.pushComm();
				}
				this.inputCommentName.classList.add('error')
				this.inputCommentText.classList.add('error')
			} else {
				if (this.inputCommentText.value) {
					this.formAvatar.innerHTML = '';
					this.formAvatar.classList.remove('form__avatar--loaded');
					return this.pushComm();
				}
				this.inputCommentText.classList.add('error')
			}
		})
	}

	domOnloader() {
		const restore = () => {
			try {
				const saved = JSON.parse(localStorage.getItem('commArr') || '[]');
				if (!Array.isArray(saved)) return;
				this.commArrAll = saved.filter(value => typeof value === 'string');
				// The legacy renderer stores HTML; strip executable elements and attributes.
				const template = document.createElement('template');
				template.innerHTML = this.commArrAll.join('');
				template.content.querySelectorAll('*').forEach(el => { if (!['DIV','SPAN','P','STRONG','B','EM','I','IMG','A','TIME','BR'].includes(el.tagName)) el.remove(); });
				template.content.querySelectorAll('*').forEach(el => [...el.attributes].forEach(a => {
					if (!['class','src','href','alt','datetime','title'].includes(a.name) || (['src','href'].includes(a.name) && !/^(https?:|data:image\/(png|jpeg|gif);base64,|[./#])/i.test(a.value))) el.removeAttribute(a.name);
				}));
				this.commentPushBlock.replaceChildren(template.content);
			} catch {}
		};
		if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore, {once:true});
		else restore();
	}
}
/////////////////////////////////////////////////////////////////////////
//comm
////////////////////////////////////////////////////////////////////////
