---
publish: true
title: 모의해킹 보고서 - lab11
created: 2026-10-27
modified: 2026-11-08T15:46:13.915Z
published: 2026-10-27
date: 2026-10-27
tags:
description:
lab: lab11
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 27일에 진행된 lab11에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab11 모의해킹에서는 .htaccess 업로드를 통한 확장자 검증 우회, 취약점이 있는 Windows 버전 사용으로 인한 취약점 연계로 NT AUTHORITY/SYSTEM 권한 탈취가 가능했다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 업로드 경로에서 .htacess 적용을 차단하고 설정 파일 업로드를 차단하며 php 파일이 실행되지 않도록 설정된 정적 파일 전용 저장소로 업로드 경로를 바꾼다. 또한 Windows OS를 최신 버전으로 업데이트하여 보안 업데이트를 진행한다.

## 3. 정보 수집 대상

개인 실습 서버 lab11을 대상으로 취약점을 점검했다. 대상 서버 lab11의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| .htaccess 업로드를 통한 확장자 검증 우회 | 최상 | jpg로 위조한 php 파일을 실행해 웹쉘이 실행 | 업로드 경로에서 .htacess 적용을 차단<br>설정 파일 업로드를 차단<br>정적 파일 전용 저장소로 업로드 경로 변경 |
| 취약점이 있는 Windows 버전 사용 | 최상 | SMB 포트로 인증 없이 원격 접속이 가능 | 최신 버전 패치 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109004509.png]]

서버에 파일 업로드가 가능한 자료실이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004514.png]]

웹쉘을 올려보려 했더니 막혔다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004518.png]]

jpg에 webshell.php를 붙인 파일을 업로드하고 실행하려 해봐도 안 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004521.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004525.png]]

`jpg`가 업로드 가능하니 `.htaccess` 로 `.jpg` 확장자에 `PHP` 타입을 연결해 `PHP` 코드로 실행할 수 있도록 설정을 넣고 자료실에 업로드한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004529.png]]

다시 웹쉘 주소로 가보니 제대로 실행된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004533.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004536.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004540.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004543.png]]

리버스 쉘을 넣어보려 했더니 Windows XP 버전이고 Python도 Powershell도 설치돼있지 않고 php 구문으로만 가능하다. 대화형 쉘도 아니고 언어팩 버전도 맞지 않아 쉘을 쓰기가 힘들다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004547.png]]

취약점을 찾아보니 `SMB` 를 이용한 취약점이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004550.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004553.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004557.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004600.png]]

`Metasploit`에서 `meterpreter` 리버스 tcp 핸들러로 세션을 연결한다. `meterpreter` 세션이 연결됐다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004603.png]]

현재 세션이 NT AUTHORITY\SYSTEM으로 실행 중이다. 권한 탈취에 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004607.png]]

CMD도 연결 가능하지만, 여전히 언어가 깨지고 쓸 수 없는 명령어가 많다.

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

### 6.1 .htaccess 업로드를 통한 확장자 검증 우회

  **6.1.1 설명**

- `.htaccess`에 서버가 `.jpg` 파일을 `PHP`로 해석하도록 처리 방식을 바꾸는 설정을 넣어 웹에 업로드해 확장자 검증을 우회했다.
- `jpg`로 위조한 `php` 파일을 실행해 웹쉘이 실행됐다.

  **6.1.2 조치방법**

- 업로드 경로에서 `.htacess` 적용을 차단한다.
- 설정 파일 업로드를 차단한다.
- `php` 파일이 실행되지 않도록 설정된 정적 파일 전용 저장소로 업로드 경로를 바꾼다.

### 6.1 취약점이 있는 Windows 버전 사용

  **6.1.1 설명**

- Windows XP 5.1.2600 버전을 쓰고 있었고 MS08-067 취약점이 있었다.
- SMB 포트로 인증 없이 원격 접속이 가능했다.

  **6.1.2 조치방법**

- 최신 OS로 업데이트 한다.
