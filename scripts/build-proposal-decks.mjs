// Run with the supplied presentation runtime. See scripts/proposal-samples/README.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const runtime = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
if (!runtime) throw new Error('Presentation runtime is required');
const require = createRequire(path.join(runtime, 'package.json'));
const { GlobalFonts } = require('@napi-rs/canvas');
const font = process.env.PROPOSAL_FONT_PATH;
if (!font) throw new Error('Set PROPOSAL_FONT_PATH to NotoSansJP.ttf');
GlobalFonts.registerFromPath(font, 'Noto Sans JP');
const artifactRequire = createRequire(path.join(runtime, '@oai/artifact-tool/package.json'));
artifactRequire('skia-canvas').FontLibrary.use('Noto Sans JP', [font]);
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(runtime, '@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const root = process.cwd();
const build = process.env.PROPOSAL_BUILD_DIR;
if (!build) throw new Error('Set PROPOSAL_BUILD_DIR to a private build directory');
const data = JSON.parse(await fs.readFile('src/components/business/chat/proposalSlides.json','utf8'));
const pricing = JSON.parse(await fs.readFile('src/components/business/chat/estimateData.json','utf8'));
const output = path.join(build,'output');
await fs.mkdir(output,{recursive:true});
const SKILL = '/root/.codex/skills/builtins/presentations';
const { finalizePresentation } = await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
const ink='#20384D', green='#315D50';
function text(slide,value,left,top,width,height,size=24,bold=false,color=ink) {
 const shape=slide.shapes.add({geometry:'textbox',position:{left,top,width,height},fill:'none',line:{style:'solid',fill:'none',width:0}});
 shape.text=value;shape.text.style={fontSize:size,typeface:'Noto Sans JP',color,bold,verticalAlignment:'top',alignment:'left',insets:0,autoFit:'none'};return shape;
}
function base(p,customer,n,title,count) {
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,'MIDORI DESIGN',56,28,240,26,18,true,green);
 text(s,customer+'様　Webサイト改修のご提案',600,28,624,26,18,false);
 text(s,title,56,81,1168,65,38,true);
 text(s,customer+'様',56,675,560,22,16,false,'#68777D');
 text(s,`${n} / ${count}`,1155,675,70,22,16,false,'#68777D');
 return s;
}
for (const variant of ['current','past']) {
 const p=Presentation.create({slideSize:{width:1280,height:720}});
 const customer=variant==='current'?'あおば商事':'こはるオフィス';const count=variant==='current'?4:3;
 for(const [i,item] of data[variant].entries()){
  const s=base(p,customer,i+1,item.title,count);
  for(const [state,x,label,color] of [['before',56,'現状の課題','#765949'],['after',664,'ご提案',green]]){
   text(s,label,x,157,540,30,25,true,color);
   s.images.add({blob:new Uint8Array(await fs.readFile(path.join(root,`public/business/proposals/${variant}-${item.topic}-${state}.jpg`))),contentType:'image/jpeg',alt:customer+' '+label+'の画面',fit:'contain',position:{left:x,top:198,width:540,height:280}});
   text(s,state==='before'?item.problem:item.proposal,x,492,540,110,24,false);
  }
  text(s,item.scope,56,615,1168,48,20,false,green);
  s.speakerNotes.text='サンプル企業の提案資料。サイト画面はscripts/proposal-samples/site.htmlを撮影した現状・改善案。写真出典: Craig Lovelidge https://unsplash.com/photos/bV5dFLEYecM / Slidebean https://unsplash.com/photos/6MtJ-y1hzTs。実在の受注実績ではない。';
 }
 if(variant==='current'){
  const s=base(p,customer,4,'概算お見積もり',4);
  const total=pricing.estimate.reduce((sum,row)=>sum+row.amount,0);
  const values=[['対応内容','数量','金額（円・税別）'],...pricing.estimate.map(r=>[r.label,r.quantity,r.amount.toLocaleString('ja-JP')]),['合計','',total.toLocaleString('ja-JP')]];
  const table=s.tables.add({rows:5,columns:3,left:56,top:175,width:1168,height:300,columnWidths:[750,170,248],values});
  table.borders.assign({fill:'#D7E1DD',width:1,style:'solid'});
  for(let r=0;r<5;r++)for(let c=0;c<3;c++){
   const cell=table.getCell(r,c);cell.fill=r===0?green:r===4?'#EDF3EF':'#FFFFFF';
   cell.text.style={fontSize:24,typeface:'Noto Sans JP',color:r===0?'#FFFFFF':ink,bold:r===0||r===4,alignment:c===2?'right':'left',verticalAlignment:'middle',insets:16};
  }
  text(s,'お見積もりの前提',56,510,1168,32,24,true);
  pricing.assumptions.forEach((line,i)=>text(s,line,56,552+i*32,1168,30,21));
  s.speakerNotes.text='概算は過去の見積一覧 E-01 90,000円、E-03 40,000円、E-06 45,000円の合計175,000円（税別）。既存デザイン・既存フォーム・事例テンプレートを使用し、原稿・写真支給と仮定。サンプルデータ。';
 }
 const candidate=path.join(build,variant+'-candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
 await finalizePresentation({workspaceDir:build,candidatePath:candidate,finalPath:path.join(output,variant+'.pptx'),pythonExecutable:process.env.CODEX_PRIMARY_RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...(variant==='current'?['--require-native-table-slide','4']:[])],explicitTotalSlideCount:count,requiredNativeTableOwnerSlides:variant==='current'?[4]:[],tableArithmeticContracts:variant==='current'?[{slide:4,table:1,label_column:0,total_row:4,value_columns:[2],component_rows:[1,2,3]}]:[],fontPolicy:{basis:'design',families:['Noto Sans JP']},verifyArtifactToolImport:true,receiptPath:path.join(build,variant+'-validation.json')});
 for(const [i,slide] of p.slides.items.entries()){
  const blob=await p.export({slide,format:'png',scale:1.5});await fs.writeFile(path.join(output,`${variant}-slide-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));
 }
 console.log(variant+' rendered and validated');
}
