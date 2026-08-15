const PRIORITIES = ["高", "中", "低"];

function makeCard(id, title, priority, daysAgo) {
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return { id, title, priority, createdAt };
}

let state = {
  lists: [
    {
      id: "list-1",
      title: "未着手",
      cards: [
        makeCard("card-1", "資料作成", "高", 1),
        makeCard("card-2", "顧客連絡", "中", 3),
      ],
    },
    {
      id: "list-2",
      title: "作業中",
      cards: [makeCard("card-3", "見積作成", "高", 2)],
    },
    {
      id: "list-3",
      title: "完了",
      cards: [makeCard("card-4", "議事録送付", "低", 5)],
    },
  ],
};

let idCounter = 5;
let draggedCardId = null;

const board = document.getElementById("board");

function clearDropIndicators() {
  document.querySelectorAll(".drop-before, .drop-after").forEach((el) => {
    el.classList.remove("drop-before", "drop-after");
  });
}

function render() {
  board.innerHTML = "";

  state.lists.forEach((list) => {
    board.appendChild(renderList(list));
  });

  board.appendChild(renderAddList());
}

function sortByPriority(list) {
  list.cards.sort((a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority));
  render();
}

function sortByCreatedAt(list) {
  list.cards.sort((a, b) => b.createdAt - a.createdAt);
  render();
}

function renderList(list) {
  const listEl = document.createElement("div");
  listEl.className = "list";
  listEl.dataset.listId = list.id;

  // ヘッダー
  const header = document.createElement("div");
  header.className = "list-header";

  const titleInput = document.createElement("input");
  titleInput.className = "list-title";
  titleInput.value = list.title;
  titleInput.addEventListener("change", () => {
    list.title = titleInput.value.trim() || list.title;
    render();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "list-delete";
  deleteBtn.textContent = "×";
  deleteBtn.title = "リストを削除";
  deleteBtn.addEventListener("click", () => {
    if (confirm(`「${list.title}」を削除しますか？`)) {
      state.lists = state.lists.filter((l) => l.id !== list.id);
      render();
    }
  });

  header.appendChild(titleInput);
  header.appendChild(deleteBtn);

  // 並び替えボタン（押した時だけその基準で並び替える。以後は再びドラッグで自由に動かせる）
  const sortBar = document.createElement("div");
  sortBar.className = "sort-bar";

  const priorityBtn = document.createElement("button");
  priorityBtn.className = "sort-btn";
  priorityBtn.textContent = "優先順位で並び替え";
  priorityBtn.addEventListener("click", () => sortByPriority(list));

  const dateBtn = document.createElement("button");
  dateBtn.className = "sort-btn";
  dateBtn.textContent = "作成日で並び替え";
  dateBtn.addEventListener("click", () => sortByCreatedAt(list));

  sortBar.appendChild(priorityBtn);
  sortBar.appendChild(dateBtn);

  // カード一覧（常に list.cards の並び順どおりに表示し、ドラッグで自由に並び替えられる）
  const cardsEl = document.createElement("div");
  cardsEl.className = "cards";

  list.cards.forEach((card) => {
    cardsEl.appendChild(renderCard(card, list));
  });

  // リスト末尾（カードが無い領域）へのドロップ受け入れ：末尾に移動
  cardsEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    listEl.classList.add("drag-over");
    if (e.target === cardsEl) {
      clearDropIndicators();
      const lastCard = cardsEl.lastElementChild;
      if (lastCard) lastCard.classList.add("drop-after");
    }
  });
  cardsEl.addEventListener("dragleave", (e) => {
    if (e.target === cardsEl) listEl.classList.remove("drag-over");
  });
  cardsEl.addEventListener("drop", (e) => {
    e.preventDefault();
    listEl.classList.remove("drag-over");
    if (e.target === cardsEl) {
      moveCard(draggedCardId, list.id, null);
    }
  });

  // カード追加ボタン
  const addCardBtn = document.createElement("button");
  addCardBtn.className = "add-card-btn";
  addCardBtn.textContent = "＋ カードを追加";
  addCardBtn.addEventListener("click", () => {
    const title = prompt("カードのタイトルを入力してください");
    if (title && title.trim()) {
      list.cards.push(makeCard(`card-${idCounter++}`, title.trim(), "中", 0));
      render();
    }
  });

  listEl.appendChild(header);
  listEl.appendChild(sortBar);
  listEl.appendChild(cardsEl);
  listEl.appendChild(addCardBtn);

  return listEl;
}

function renderCard(card, list) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.draggable = true;
  cardEl.dataset.cardId = card.id;

  cardEl.addEventListener("dragstart", (e) => {
    draggedCardId = card.id;
    cardEl.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  cardEl.addEventListener("dragend", () => {
    cardEl.classList.remove("dragging");
    draggedCardId = null;
    clearDropIndicators();
  });

  // カードの前後どちらに差し込むかを判定し、青いラインで挿入位置を示す
  cardEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (card.id === draggedCardId) return;

    const rect = cardEl.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    clearDropIndicators();
    cardEl.classList.add(before ? "drop-before" : "drop-after");
  });
  cardEl.addEventListener("dragleave", () => {
    cardEl.classList.remove("drop-before", "drop-after");
  });
  cardEl.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = cardEl.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    moveCard(draggedCardId, list.id, card.id, before);
  });

  const topRow = document.createElement("div");
  topRow.className = "card-top";

  const titleEl = document.createElement("div");
  titleEl.className = "card-title";
  titleEl.contentEditable = "true";
  titleEl.textContent = card.title;
  titleEl.addEventListener("blur", () => {
    card.title = titleEl.textContent.trim() || card.title;
  });
  titleEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleEl.blur();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card-delete";
  deleteBtn.textContent = "×";
  deleteBtn.title = "カードを削除";
  deleteBtn.addEventListener("click", () => {
    list.cards = list.cards.filter((c) => c.id !== card.id);
    render();
  });

  topRow.appendChild(titleEl);
  topRow.appendChild(deleteBtn);

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const prioritySelect = document.createElement("select");
  prioritySelect.className = `priority-select priority-${card.priority}`;
  PRIORITIES.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = `優先度：${p}`;
    if (card.priority === p) opt.selected = true;
    prioritySelect.appendChild(opt);
  });
  prioritySelect.addEventListener("change", () => {
    card.priority = prioritySelect.value;
    render();
  });

  const dateEl = document.createElement("span");
  dateEl.className = "card-date";
  dateEl.textContent = formatDate(card.createdAt);

  meta.appendChild(prioritySelect);
  meta.appendChild(dateEl);

  cardEl.appendChild(topRow);
  cardEl.appendChild(meta);

  return cardEl;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

function renderAddList() {
  const wrapper = document.createElement("div");
  wrapper.className = "add-list";

  const btn = document.createElement("button");
  btn.className = "add-list-btn";
  btn.textContent = "＋ リストを追加";
  btn.addEventListener("click", () => {
    const title = prompt("リスト名を入力してください");
    if (title && title.trim()) {
      state.lists.push({
        id: `list-${idCounter++}`,
        title: title.trim(),
        cards: [],
      });
      render();
    }
  });

  wrapper.appendChild(btn);
  return wrapper;
}

// targetCardId が null の場合は末尾に追加。before が true ならそのカードの直前に挿入。
function moveCard(cardId, targetListId, targetCardId, before) {
  let movedCard = null;

  state.lists.forEach((list) => {
    const idx = list.cards.findIndex((c) => c.id === cardId);
    if (idx !== -1) {
      movedCard = list.cards.splice(idx, 1)[0];
    }
  });

  if (!movedCard) return;

  const targetList = state.lists.find((l) => l.id === targetListId);
  if (!targetList) return;

  if (!targetCardId) {
    targetList.cards.push(movedCard);
  } else {
    const idx = targetList.cards.findIndex((c) => c.id === targetCardId);
    const insertAt = before ? idx : idx + 1;
    targetList.cards.splice(insertAt, 0, movedCard);
  }

  render();
}

render();
