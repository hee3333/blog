---
publish: true
title: 모의해킹 보고서 - lab12
created: 2026-11-05
modified: 2026-11-08T15:57:01.134Z
published: 2026-11-05
date: 2026-11-05
tags:
description:
lab: lab12
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 5일에 진행된 lab12에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab12 모의해킹에서는 웹 페이지에 노출된 비밀번호, 키오스크 보안 설정 취약점, MySQL 관리자 자격 증명 평문 노출, UDF DLL을 통한 MySQL의 SYSTEM 권한 실행의 취약점 연계가 권한 상승으로 이어졌다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 노출된 계정 관련 정보 값을 삭제하고, `Windows Assigned Access`로 키오스크를 구성하여 Edge 혹은 키오스크 앱만 사용 가능하도록 제한, Edge의 URL 허용 목룍에서 `file://` 주소 차단, `MySQL`의 서비스 권한을 낮추고 `C:\MySQL\lib\plugin`에서 `Authenticated Users`의 수정 권한을 제거해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab12을 대상으로 취약점을 점검했다. 대상 서버 lab12의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| 웹 페이지에 노출된 비밀번호 | 최상 | 로그인 페이지에 비밀번호에 대한 힌트가 있었고 웹페이지에 비밀번호가 노출 | 노출된 계정 관련 정보값들을 삭제 |
| 키오스크 보안 설정 취약점 | 최상 | Edge 브라우저에서 file://로 로컬 접속/탐색이 가능 | Windows Assigned Access로 키오스크를 구성<br>Edge의 URL 허용 목룍에서 file:// 주소 차단 |
| MySQL 관리자 자격 증명 평문 노출 | 최상 | 읽을 수 있는 refresh-dates.bat에 MySQL root 비밀번호 노출 | 노출된 비밀번호 정보를 삭제 |
| UDF DLL을 통한 MySQL의 SYSTEM 권한 실행 | 최상 | MySQL의 Localsystem 계정 실행 권한으로 UDF DLL을 실행해 권한 상승 | MySQL 서비스 권한 낮추기<br>C:\MySQL\lib\plugin에서 Authenticated Users의 수정 권한을 제거 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109005508.png]]

주어진 대상 서버의 최고 권한을 탈취해야 한다. 예약 확인 코드 힌트가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005512.png]]

대상 서버를 스캔해보니 `RPC`, `RDP`, `WinRM`과 `HTTPAPI` 포트가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005516.png]]

`gobuster`로 스캔해보니 `login` 페이지가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005520.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005523.png]]

로그인 페이지 `forget your password?` 부분에 커서를 올려보면 버프 스위트에서 보이는 것과 같이 힌트가 나온다.

- 힌트 : DeviceHub 패키지 장치의 일련 번호.

![[00. Setting/00. 첨부파일/Pasted image 20261109005527.png]]

`gobuster`에서 본 다른 페이지를 스캔해보면 status 하위 페이지가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005531.png]]

일련번호를 확인했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005534.png]]

로그인하면 여권 스캐너, 탑승 티켓 프린터 페이지와 함께 Username과 Password가 노출되어 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005537.png]]

노출된 계정 정보로 rdp로 로그인한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005541.png]]

여권과 탑승티켓의 셀프 체크인 페이지가 나온다. 아까의 관리 페이지는 이 프로그램과 연동되어 있는 듯 하다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005544.png]]

처음 본 힌트를 넣고 조회하면 스캐너 페이지로 들어간다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005547.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005550.png]]

스캐너를 끄고 스캔을 하면 에러 메세지가 뜬다. 연결되는 주소로 들어가서 주소창에 `file:///C:/`를 입력하면

![[00. Setting/00. 첨부파일/Pasted image 20261109005554.png]]

시스템 디렉토리 목록이 뜬다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005558.png]]

파워셸 실행 후 첫번째 Flag 확인.

![[00. Setting/00. 첨부파일/Pasted image 20261109005601.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005605.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005608.png]]

권한 상승을 위해 `mysql-error.log`를 보니 `kiosk_app`이 실행되고 있는 것 같다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005611.png]]

`Kiosk_app` 관련해서 디렉토리를 찾아보니 `C:\ProgramData\HTB Airways\db-config.ini` 경로가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005615.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005619.png]]

찾은 경로에서 MySQL로 접속하는 root 비밀번호를 찾았다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005623.png]]

MySQL80의 권한이 가장 넓은 권한을 갖는 Localsystem. MySQL로 실행할 수 있는 파일을 찾아 권한 상승을 해보자.

![[00. Setting/00. 첨부파일/Pasted image 20261109005627.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005630.png]]

MySQL에 접속해서 실행할 UDF DLL(MySQL에 기능을 추가하는 외부 라이브러리 파일)을 찾도록 Plugin\_dir의 경로를 확인한다.

secure\_file\_priv (MySQL이 SQL명령으로 파일을 읽거나 쓸 수 있는 범위 확인)을 보니 파일을 가져올 권한이 없다. -> `certutil`을 써야 한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005634.png]]

`SHOW GRNATS;` 로 현재 계정이 할 수 있는 작업을 확인한다. 현재 접속한 root 계정이 자신이 가진 권한을 부여할 수 있다는 것을 확인했다. (WITH GRANT OPTION)

![[00. Setting/00. 첨부파일/Pasted image 20261109005638.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005641.png]]

plugin 경로에 로그인한 사용자 계정이 수정 권한(M)이 있음을 확인 했지만 plugin 폴더에 명령 실행 가능한 dll 파일이라고 확신할 파일이 없다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005644.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109005648.png]]

로컬 칼리의 `Metasploit`의 `mysql` 폴더에서 `lib_mysqludf_sys_64.dll` 파일을 받아온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005651.png]]

MySQL 재접속, sys\_exec(windows 명령을 실행하고 종료 코드를 돌려줌), sys\_eval(windows 명령을 실행하고 결과 글자를 돌려줌) 함수를 등록하면 MySQL의 Localsystem 권한으로 실행되어서 whoami 명령어에 NT AUTHORITY\SYSTEM 16진수 문자열의 결과가 나온다.

필요한 건 Flag이므로 관리자 경로의 플래그를 확인한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109005654.png]]

16진수를 문자열로 바꾸면 Flag 획득 성공.

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

### 6.1 웹 페이지에 노출된 비밀번호

  **6.1.1 설명**

- 로그인 페이지에 비밀번호에 대한 힌트가 있었고 웹페이지에 비밀번호가 노출되어 있었다.
- 로그인에 성공하여 관리자 페이지에 명시된 또 다른 유저 이름과 비밀번호로 RDP에 접속이 가능했다.

  **6.1.2 조치방법**

- 노출된 계정 관련 정보값들을 삭제한다.

### 6.2 키오스크 보안 설정 취약점

  **6.2.1 설명**

- Edge 브라우저에서 file://로 로컬 접속/탐색이 가능했다.
- powershell 실행으로 권한 탈취가 가능했다.

  **6.2.2 조치방법**

- Windows Assigned Access로 키오스크를 구성하여 Edge 혹은 키오스크 앱만 사용 가능하도록 제한.
- Edge의 URL 허용 목룍에서 file:// 주소 차단하기

### 6.3 MySQL 관리자 자격 증명 평문 노출

  **6.3.1 설명**

- 읽을 수 있는 refresh-dates.bat에 MySQL root 비밀번호 노출.
- root로 MySQL에 접속하여 넓은 권한으로 실행이 가능했다.
    **6.3.2 조치방법**
- 노출된 비밀번호 정보를 삭제하고, 이미 노출된 비밀번호는 변경한다.

### 6.4 UDF DLL을 통한 MySQL의 SYSTEM 권한 실행

  **6.4.1 설명**

- MySQL의 `Localsystem` 계정 실행 권한으로 UDF DLL을 실행해 권한이 바뀌었다.
- `Localsystem` 권한으로 UDF DLL을 실행해 권한을 넘겨주니 `NT AUTHORITY\SYSTEM` 권한 상승이 가능했다.

  **6.4.2 조치방법**

- `MySQL` 서비스 권한 낮추기
- `C:\MySQL\lib\plugin`에서 `Authenticated Users`의 수정 권한을 제거.
