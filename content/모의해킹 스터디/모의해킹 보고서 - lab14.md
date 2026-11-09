---
publish: true
title: 모의해킹 보고서 - lab14
description: 익명으로 접근 가능했던 FTP와 그렇게 얻은 계정 정보로 PRTG Network Monitor의 취약점을 공격해 NT AUTHORITY/SYSTEM 권한 탈취 성공
created: 2026-11-09
modified: 2026-11-09T05:42:51.990Z
published: 2026-11-09
tags:
  - Windows
  - PRTGNetMon
  - FTP
  - Anonymous
  - github
  - reverseshell
date: 2026-11-09
lab: lab14
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 9일에 진행된 lab14에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab14 모의해킹에서는 익명으로 접근 가능했던 FTP와 취약점이 있는 PRTG Network Monitor 버전 사용의 연계로 최고 권한 탈취가 가능했다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 . FTP는 Anonymous Authentication 설정을 끄고 필요한 계정만 허용, 공개 폴더만 연결해서 읽기 전용으로 설정, 노출된 파일은 삭제하고 비밀번호를 변경하고 PRTG Network Monitor은 취약점이 패치된 버전으로 업데이트를 해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab14을 대상으로 취약점을 점검했다. 대상 서버 lab14의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름                             | 위험도 | 설명                      | 대응방안                                                                                                   |
| :--------------------------------- | :-- | :---------------------- | :----------------------------------------------------------------------------------------------------- |
| 익명으로 접근 가능한 FTP                    | 최상  | 계정 정보 등의 탈취 가능          | 1. Anonymous Authentication 설정을 끄고 필요한 계정만 허용<br>2. 공개 폴더만 연결해서 읽기 전용으로 설정<br>3. 노출된 파일은 삭제하고 비밀번호를 변경 |
| 취약점이 있는 PRTG Network Monitor 버전 사용 | 최상  | 로그인 계정 정보로 리버스 쉘 연결이 가능 | 취약점이 패치된 버전으로 업데이트                                                                                     |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109104549.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109104625.png]]
대상 서버를 포트 스캔 해보니 `FTP` 와 `HTTP`, `RPC`, `Netbois-ssn`, `SMB`  가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109133315.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109133111.png]]
`gobuster` 로 웹페이지를 스캔 후 `/index.htm`으로 접속해보니 `PRTG Network Monitor (NETMON)` 이 나온다.

현재 로그인을 할 수 있는 정보가 없으니 익명으로 `FTP`부터 접속해본다.

```
Name: anonymous
Password: anonymous@example.com
```

![[00. Setting/00. 첨부파일/Pasted image 20261109104749.png]]

접속 성공했다.

![[00. Setting/00. 첨부파일/Pasted image 20261109111858.png]]

`C:\ProgramData\Paessler\PRTG Network Monitor` 에 접근해보니 PRTG에 대한 구성 정보들이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109133523.png]]

PRTG Configuration.old.bak부터 받아본다.

![[00. Setting/00. 첨부파일/Pasted image 20261109140650.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109140726.png]]

prtgadmin의 비밀번호가 있다. 하지만 비밀번호가 맞지 않는다. 현재 버전의 비밀번호가 필요하다.

![[00. Setting/00. 첨부파일/Pasted image 20261109140528.png]]

`Configuraton Auto-Backups` 에서 `PRTG Configuration (Update to 18.37.13946).zip` 파일을 받는다.

![[00. Setting/00. 첨부파일/Pasted image 20261109141306.png]]

안에 2019년도에 만들어진 `PRTG Configuration.dat` 파일이 있다. 비밀번호가 `2018`이 들어가니 현재 버전은 이 파일의 버전, 즉 `2019` 가 아닐까 추측해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261109141624.png]]

로그인 성공.

![[00. Setting/00. 첨부파일/Pasted image 20261109141825.png]]

zip 파일의 18.1.37.13946은 프로그램 버전임을 알았다.
취약점을 검색해보니 `CVE-2018-9276` 가 나왔다. PRTG Network Monitor의 인증된 명령 삽입 취약점.

![[00. Setting/00. 첨부파일/Pasted image 20261109134010.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109140308.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261109133743.png]]

`Github`에서 취약점 `CVE-2018-9276`에 관련된 `revershell` 코드를 찾았고 연결해보니 성공했다.

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

### 6.1  익명으로 접근 가능한 FTP

  **6.1.1 설명**

- 익명으로 FTP에 접근할 수 있었다.
- 계정 정보 등의 탈취가 가능했다

  **6.1.2 조치방법**

- Anonymous Authentication 설정을 끄고 필요한 계정만 허용한다.
- 공개 폴더만 연결해서 읽기 전용으로 설정한다.
- 노출된 파일은 삭제하고 비밀번호를 변경한다.

### 6.2  취약점이 있는 PRTG Network Monitor 버전 사용

  **6.1.1 설명**

- CVE-2018-9276 취약점이 있는 `PRTG Network Monitor` 18.1.13946 버전을 쓰고 있었다.
- 로그인 계정 정보로 리버스 쉘 연결이 가능했고, 권한 탈취로 이어졌다.

  **6.1.2 조치방법**

- 취약점이 패치된 버전으로 업데이트 한다.
