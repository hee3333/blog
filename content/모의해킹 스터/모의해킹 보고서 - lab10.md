---
publish: true
title: 모의해킹 보고서 - lab10
created: 2026-10-23
modified: 2026-11-08T15:41:38.493Z
published: 2026-10-23
date: 2026-10-23
tags:
description:
lab: lab10
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 23일에 진행된 lab10에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab10 모의해킹에서는 `SMB`에서 인증 없이 C 드라이브 전체를 공유하고 있었고, 그로 인해 `C:\Windows\Panther` 경로에 민감 정보가 있을 수 있는 `unattend.xml`파일을 발견해 `devopsadm`의 권한으로 Powershell에 접속해서 바인드 쉘로 `Administrators` 그룹에 속할 수 있었다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 CShare의 공유를 해제하고 필요한 폴더만 공유할 수 있게 설정을 바꾸고, 민감정보가 남아있는 unattend.xml 등의 무인 설치 응답 파일을 지우며 이미 노출된 비밀번호는 변경을 권고한다.

## 3. 정보 수집 대상

개인 실습 서버 lab10을 대상으로 취약점을 점검했다. 대상 서버 lab10의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| 비밀번호 인증 없는 SMB의 C 드라이브 전체 공유 | 최상 | 민감 정보에 접근이 가능 | CShare의 공유를 해제<br>필요한 폴더만 공유할 수 있게 설정 변경 |
| 하드 코딩된 파일 노출 | 최상 | devopsadm의 비밀번호가 노출되어 있어 powershell 원격 접속이 가능 | 민감정보가 남아있는 무인 설치 응답 파일 삭제<br>노출된 비밀번호 변경 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109004030.png]]

포트 스캔을 해보니 `RPC`, `netbios-ssn`, `SMB`, `HTTPAPI`가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004033.png]]

아직 어떤 정보가 없으니`SMB`에 계정 없이 볼 수 있는 공유 폴더를 확인해본다. `CShare`가 열려있다. (\$가 붙은 공유 폴더는 숨겨져 있음)

![[00. Setting/00. 첨부파일/Pasted image 20261109004038.png]]

비밀번호 없이 접근이 가능하다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004042.png]]

`devopsadm`이란 유저가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004046.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004050.png]]

하드 코딩된 정보를 찾고자 `C:\Windows\Panther` 폴더에서 `unattended.xml` 파일을 열어보면 `devopsadm`의 비밀번호가 보인다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004053.png]]

`devopsadm`으로 이번엔 원격 powershell(`Evil-WinRM`)로 접근한다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004056.png]]

`devopsadm`도 쓰기 권한이 있는 `Xlight` 폴더를 조사해보니 Xlight FTP Server의 설치 폴더로 보인다. 실행 권한도 있으니 여기에 쉘을 심어 관리자 그룹 권한에 `devopsadm`을 넣어보자.

![[00. Setting/00. 첨부파일/Pasted image 20261109004101.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004105.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004109.png]]

로컬 칼리에서`devopsadm`을 `Administrators` 그룹에 넣는 바인드 쉘을 만들고 윈도우 대상 서버로 넘겨준다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004112.png]]

리스트를 확인해보면 바인드 쉘 실행 파일이 잘 들어가 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004117.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109004120.png]]

바인드 쉘 파일을 기존 xlight 실행 파일인 `xlight.exe`에 덮어 씌운다. 현재 프로세스가 실행 중이라 수정할 수 없다고 뜬다. 서비스를 중단하고 다시 덮어 씌운 후 리스트를 확인하면 `xlight.exe`의 length가 바인드 쉘의 length와 같아졌다.

![[00. Setting/00. 첨부파일/Pasted image 20261109004130.png]]

다시 실행해서 `Administrators` 그룹 내역을 확인해보면 `devopsadm`이 추가 되었다.

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

### 6.1 비밀번호 인증 없는 SMB의 C 드라이브 전체 공유

  **6.1.1 설명**

- 비밀번호 없는 유저 권한으로 `Cshare`에 접근이 됐다.
- 공유 폴더로 지정된 `CShare`폴더는 C 드라이브 전체를 볼 수 있는 폴더로 민감 정보에 접근이 가능했다.

  **6.1.2 조치방법**

- CShare의 공유를 해제하고 필요한 폴더만 공유할 수 있게 설정을 바꾼다.

### 6.2 하드 코딩된 파일 노출

  **6.2.1 설명**

- `C:\Windows\Panther` 경로에 민감 정보가 있을 수 있는 `unattend.xml`파일을 발견했다.
- `devopsadm`의 비밀번호가 노출되어 있어 powershell 원격 접속이 가능했다.

  **6.2.2 조치방법**

- 민감정보가 남아있는 `unattend.xml` 등의 무인 설치 응답 파일을 지운다.
- 노출된 비밀번호는 변경한다.
