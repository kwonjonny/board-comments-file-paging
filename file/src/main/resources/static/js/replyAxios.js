// Create Reply
const registReply = async (list) => {
    console.log("list: ", list)
    const { data } = await axios.post(`${replyLink}/${tno}/create`, list)
    return data;
}

// List Reply To Server 
const replyListToServer = async (replyLast = false, page = 1) => {
    console.log("replyLast", replyLast, "page", page)
    const res = await axios.get(`${replyLink}/${tno}/list?page=${page}&replyLast=${replyLast}`)
    return res.data;
}

// Delete Reply 
const deleteReply = async (rno) => {
    const { data } = await axios.delete(`${replyLink}/${rno}`)
    return data;
}

// Update Reply
const modifyReply = async (list) => {
    const { data } = await axios.put(`${replyLink}/update`, list)
    return data;
}

// List Reply Axios
const replyListAxios = (replyLast, page) => {
    replyListToServer(replyLast, page).then(arr => {
        // console.log(arr)

        let replyStr = ""
        let replyPagingStr = ""
        for (let i = 0; i < arr.list.length; i++) {
            const { reply, replyer, replyDate, modifyDate, step, gno, rno, isDeleted, tno } = arr.list[i]
            replyStr +=
                `
            <div class="card mb-3" ${step === 0 ? "" : "style='margin-left:60px;'"} data-gno="${gno}"> 
                <div class="card-body"> 
                    <div class="row">
                    <div class="col">
                        <!-- New box for the reply content -->
                        <div class="reply-content">
                        <h6 class="mb-0">${reply}</h6>
                        <span>Replyer: ${replyer}</span>
                        <div class="d-flex justify-content-between">
                            <small>Reply Date: ${replyDate}</small>  
                            <small>Modify Date: ${modifyDate}</small>
                        </div>
                        </div>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                        <button class="btn btn-outline-secondary reply-delete" data-reply="replyDelete" data-rno="${rno}">삭제</button>
                        <button class="btn btn-outline-secondary reply-update" data-reply="replyUpdate"  data-gno="${gno}" data-tno="${tno}" data-rno="${rno}" data-replyer="${replyer}" data-reply="${reply}">수정</button>
                        <button class="btn btn-outline-secondary reply-replyChild" data-reply="replyChild" data-rno="${rno}">답글달기</button>
                        </div>
                    </div>
                </div>
            </div>
          `
        }
        const { page, size, startNum, endNum, prevBtn, nextBtn, replyLast, total } = arr

        prevBtn === true ? replyPagingStr += `<li><button data-page="${startNum - 1}" class="btn btn-primary">이전</button></li>` : ""

        for (let i = startNum; i <= endNum; i++) {
            replyPagingStr += `
        <li${page === i ? " class='active'" : ''}>
          <button data-page="${i}" class="btn btn-primary">${i}</button>
        </li>`
        }
        nextBtn === true ? replyPagingStr += `<li><button data-page="${endNum + 1}" class="btn btn-primary">다음</button></li>` : ""

        replyWrap.innerHTML = replyStr
        replyPaging.innerHTML = replyPagingStr
    })
}


document.addEventListener('DOMContentLoaded', (event) => {
    const replyWrap = document.querySelector('.replyWrap');

    ///////////////
    // 답글 입니다 //
    //////////////
    // 답글 버튼 클릭 이벤트 리스너 추가
    replyWrap.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("reply-replyChild")) {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target;

            if (target.dataset.reply === "replyChild") {
                const rno = target.dataset.rno;
                const gno = target.closest(".card").dataset.gno; // 부모 댓글의 gno 값 가져오기
                const replyContentElement = target.closest(".card-body").querySelector(".reply-content");

                // 답글 작성 폼 생성
                const replyForm = document.createElement("div");
                replyForm.innerHTML = `
                <div class="reply-form-wrapper">
                    <input type="text" class="form-control replyer-input" placeholder="작성자" />
                    <textarea class="form-control reply-input" rows="3" placeholder="답글 내용을 입력하세요" data-gno="${gno}" data-tno="${tno}"></textarea>
                        <div class="reply-buttons">
                        <button class="btn btn-primary reply-submit" data-rno="${rno}">작성 완료</button>
                        <button class="btn btn-secondary reply-cancel">취소</button>
                    </div>
                </div>
                `;

                // 기존 답글 내용 밑에 답글 작성 폼 추가
                const replyContent = replyContentElement.innerHTML;
                replyContentElement.innerHTML += replyForm.innerHTML;
                // 작성 완료 버튼 클릭 이벤트 리스너 추가

                const replySubmitBtn = replyContentElement.querySelector(".reply-submit");
                replySubmitBtn.addEventListener("click", () => {
                    const replyerInput = replyContentElement.querySelector(".replyer-input");
                    const replyInput = replyContentElement.querySelector(".reply-input");
                    const replyer = replyerInput.value;
                    const reply = replyInput.value;
                    const gno = target.closest(".card").dataset.gno;
                    const tno = replyInput.dataset.tno;

                    // 답글 등록 처리 (Ajax 등)
                    const list = {
                        replyer: replyer,
                        reply: reply,
                        gno: gno,
                        tno: tno
                    };
                    // registReply 함수 호출
                    registReply(list)
                        .then((response) => {
                            // 답글 등록 성공 시 처리할 로직
                            console.log(response);

                            // 답글 작성 폼 제거
                            replyContentElement.innerHTML = replyContent;

                            // 답글 등록 후 댓글 목록을 다시 로드
                            replyListAxios(false, 1);
                        })
                });

                // 취소 버튼 클릭 이벤트 리스너 추가
                const replyCancelBtn = replyContentElement.querySelector(".reply-cancel");
                replyCancelBtn.addEventListener("click", () => {
                    // 답글 작성 폼 제거
                    replyContentElement.innerHTML = replyContent;
                });
            }
        }
    });


    //////////////
    // 삭제 입니다 //
    //////////////
    // 삭제 버튼에 대한 이벤트 리스너
    replyWrap.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("reply-delete")) {
            const rno = e.target.dataset.rno;
            deleteReply(rno).then((response) => {
                // 삭제 성공 시 처리할 로직
                console.log(response);
                // 댓글 목록 다시 로드
                replyListAxios(false, 1);
            });
        }
    });


    //////////////
    // 수정 입니다 //
    //////////////

    // 수정 이벤트 리스너
    replyWrap.addEventListener("click", (e) => {
        const target = e.target;

        if (target && target.classList.contains("reply-update")) {
            const replyContentElement = target.closest(".card-body").querySelector(".reply-content");
            const replyText = replyContentElement.querySelector("h6.mb-0").innerText;

            // 기존 댓글 내용을 가져오기
            const rno = target.dataset.rno;
            const replyer = target.dataset.replyer;
            const tno = target.dataset.tno;
            const gno = target.dataset.gno;

            // 수정 폼 생성
            const replyForm = document.createElement("div");
            replyForm.innerHTML = `
            <div class="reply-form-wrapper">
                <input type="text" class="form-control replyer-input" placeholder="작성자" value="${replyer}" readOnly />
                <textarea class="form-control reply-input" rows="3" placeholder="댓글 내용을 입력하세요">${replyText}</textarea>
                <div class="reply-buttons">
                    <button class="btn btn-primary reply-update-confirm" data-rno="${rno}">확인</button>
                    <button class="btn btn-secondary reply-update-cancel">취소</button>
                </div>
            </div>
        `;

            // 기존 댓글 내용을 수정 폼으로 바꾸기
            replyContentElement.innerHTML = '';
            replyContentElement.appendChild(replyForm);

            // 확인 버튼 클릭 이벤트 리스너
            const confirmButton = replyContentElement.querySelector(".reply-update-confirm");
            confirmButton.addEventListener("click", () => {
                const newReply = replyContentElement.querySelector(".reply-input").value;

                const list = {
                    replyer: replyer,
                    reply: newReply,
                    rno: rno,
                    tno: tno,
                    gno: gno
                };

                // 수정된 댓글을 서버로 보냄
                modifyReply(list).then((response) => {
                    console.log(response);
                    // 댓글 목록 다시 로드
                    replyListAxios(false, 1);
                });
            });

            // 취소 버튼 클릭 이벤트 리스너
            const cancelButton = replyContentElement.querySelector(".reply-update-cancel");
            cancelButton.addEventListener("click", () => {
                // 댓글 목록 다시 로드
                replyListAxios(false, 1);
            });
        }
    });

});

