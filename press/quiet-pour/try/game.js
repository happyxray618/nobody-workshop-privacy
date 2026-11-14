(function(root){
  'use strict';
  const copy=b=>b.map(t=>t.slice());
  function pour(board,from,to){
    if(from===to||!board[from]||!board[to]||!board[from].length||board[to].length>=4)return null;
    const a=board[from],b=board[to],colour=a[a.length-1];
    if(b.length&&b[b.length-1]!==colour)return null;
    let n=0;for(let i=a.length-1;i>=0&&a[i]===colour;i--)n++;
    n=Math.min(n,4-b.length);const next=copy(board);
    next[from].splice(-n,n);next[to].push(...Array(n).fill(colour));return next;
  }
  function won(board){return board.some(t=>t.length)&&board.every(t=>!t.length||(t.length===4&&t.every(c=>c===t[0])));}
  const api={copy,pour,won};
  if(typeof module!=='undefined')module.exports=api;
  else root.QuietPourRules=api;
})(typeof window!=='undefined'?window:globalThis);

