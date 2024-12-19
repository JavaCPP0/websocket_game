<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>게임 프로젝트 파일 구조</h1>
    <ul>
        <li>assets
            <ul>
                <li class="file">item.json</li>
                <li class="file">item_unlock.json</li>
                <li class="file">stage.json</li>
            </ul>
        </li>
        <li class="file">package-lock.json</li>
        <li class="file">package.json</li>
        <li>public
            <ul>
                <li class="file">CactiController.js 선인장의 생성과 위치 업데이트같은 상태를 다루는 컨트롤러</li>
                <li class="file">Cactus.js</li> 선인장 클래스
                <li class="file">Constants.js</li> 버전 클래스
                <li class="file">Ground.js</li> 땅(맵) 클래스
                <li class="file">index.js</li> 메인 코드
                <li class="file">item.js</li> 아이탬 클래스
                <li class="file">ItemController.js 스태이지별로 상이한 아이탬 생성과 어뷰징검사</li>
                <li class="file">Player.js 플레이어 객체 </li>
                <li class="file">Score.js 화면에 점수를 표시하고 스코어들을 가져오고 게임 진행에 따라 스코어가 상승하고 일정 스코어를 넘으면 스테이지 변경 스코어클래스</li>
                <li class="file">Socket0.js 소캣을 등록하는 곳</li>
                <li class="file">styles.css 프론트 디자인</li>
            </ul>
        </li>
        <li class="file">readme.md</li>
        <li>src
            <ul>
                <li class="file">app.js 웹소캣 만들고 초기화하는곳</li>
                <li class="file">constants.js</li>
                <li>handlers
                    <ul>
                        <li class="file">game.handler.js 게임의 시작과 종료를 다룸</li>
                        <li class="file">handlerMapping.js 핸들러들을 번호로 매핑해서 다루기 쉽게</li>
                        <li class="file">helper.js 플레이어가 연결/종료 또는 이벤트가 발생하면 핸들러를 찾아주는등의 도움주는 파일</li>
                        <li class="file">high.score.handler.js 하이스코어를 다루는 핸들러</li>
                        <li class="file">regiser.handler.js 유저가 접속하면 등록하는 핸들러</li>
                        <li class="file">stage.handler.js 스태이지가 변경되면 유효성 검사</li>
                    </ul>
                </li>
                <li>init
                    <ul>
                        <li class="file">assets.js json파일을 읽어오는 곳</li>
                        <li class="file">socket.js WebSocket 서버(io)를 기존의 HTTP 서버(server)에 연결</li>
                    </ul>
                </li>
                <li>models
                    <ul>
                        <li class="file">stage.model.js</li>
                        <li class="file">user.model.js</li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</body>
</html>
