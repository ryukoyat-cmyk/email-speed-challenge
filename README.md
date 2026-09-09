# 메일 타이핑 스피드 챌린지

GitHub Pages에서 동작하는 서버리스 정적 웹앱입니다.

## 배포용 학생 데이터

`app.js`의 `STUDENTS` 배열을 교사용 변환 도구가 생성한 `{ grade, classroom, name, emailHash }` 데이터로 교체하세요. 이메일 원문은 업로드하지 않습니다. SHA-256 해시는 브라우저 `crypto.subtle`로 입력값을 해시해 비교합니다.

현재 `student-data.js`에는 교사용 TXT에서 변환한 학생별 SHA-256 해시값이 들어 있습니다. 이메일 원문과 원본 TXT는 저장소에 포함하지 않습니다.

GitHub 저장소의 Settings → Pages에서 배포 브랜치의 root를 선택하면 됩니다.

