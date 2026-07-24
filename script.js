const cards=[...document.querySelectorAll('.menu-card')];
const filters=[...document.querySelectorAll('.category-button')];
const emptyMessage=document.querySelector('.empty-message');
const viewer=document.querySelector('.viewer');
const viewerImage=document.querySelector('.viewer-image');
const viewerTitle=document.querySelector('.viewer-title');
const pdfViewer=document.querySelector('.pdf-viewer');
const pdfCanvas=document.querySelector('.pdf-canvas');
const pdfPageNumber=document.querySelector('.pdf-page-number');
let activeFilter='all';let activePdf=null;let activePage=1;let pdfDocument=null;

const refresh=()=>{let visible=0;cards.forEach(card=>{const show=card.dataset.available!=='false'&&(activeFilter==='all'||card.dataset.category===activeFilter);card.hidden=!show;if(show)visible++});emptyMessage.hidden=visible!==0};
const renderPdfPage=async pageNumber=>{if(!pdfDocument)return;const page=await pdfDocument.getPage(pageNumber);const base=page.getViewport({scale:1});const scale=Math.min(2.2,720/base.width);const viewport=page.getViewport({scale});pdfCanvas.width=viewport.width;pdfCanvas.height=viewport.height;await page.render({canvasContext:pdfCanvas.getContext('2d'),viewport}).promise;pdfPageNumber.textContent=`${pageNumber} / ${pdfDocument.numPages}`;document.querySelector('.pdf-prev').disabled=pageNumber<=1;document.querySelector('.pdf-next').disabled=pageNumber>=pdfDocument.numPages};
const openPdf=async card=>{if(!window.pdfjsLib){window.open(card.dataset.pdf,'_blank');return}viewerImage.hidden=true;pdfViewer.hidden=false;viewerTitle.textContent=card.dataset.title;viewer.showModal();activePdf=card.dataset.pdf;activePage=1;pdfDocument=await window.pdfjsLib.getDocument(activePdf).promise;await renderPdfPage(activePage)};
cards.forEach(card=>{const image=card.querySelector('img');if(image){image.addEventListener('error',()=>{card.dataset.available='false';refresh()})}card.addEventListener('click',()=>card.dataset.pdf?openPdf(card):(viewerImage.src=card.dataset.image,viewerImage.alt=card.dataset.title,viewerImage.hidden=false,pdfViewer.hidden=true,viewerTitle.textContent=card.dataset.title,viewer.showModal()))});
filters.forEach(filter=>filter.addEventListener('click',()=>{filters.forEach(item=>item.classList.remove('is-active'));filter.classList.add('is-active');activeFilter=filter.dataset.filter;refresh()}));
document.querySelector('.pdf-prev').addEventListener('click',()=>{if(activePage>1)renderPdfPage(--activePage)});document.querySelector('.pdf-next').addEventListener('click',()=>{if(pdfDocument&&activePage<pdfDocument.numPages)renderPdfPage(++activePage)});document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()});
