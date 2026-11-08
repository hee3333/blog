---
publish: true
title: 모의해킹 보고서 - lab09
created: 2026-10-22
modified: 2026-11-08T15:38:25.542Z
published: 2026-10-22
date: 2026-10-22
tags:
description:
lab: lab09
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 10월 22일에 진행된 lab09에 대한 모의 해킹 보고서이다.

## 2. 총평

이번 lab09 모의해킹에서는 취약점으로 RiteCMS의 초기 로그인 정보 미변경, 취약한 RiteCMS 버전 사용이 확인되었다. 각 취약점의 연계로 웹 관리 페이지 접근을 시작으로 취약점을 이용한 웹쉘 업로드, 최종 시스템 권한 획득까지 이어졌다. 이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해 RiteCMS를 보안 패치가 적용된 지원 버전으로 업데이트하고, 관리 페이지의 접근 범위를 제한하고. 초기 로그인 정보를 변경해야 한다.

## 3. 정보 수집 대상

개인 실습 서버 lab09을 대상으로 취약점을 점검했다. 대상 서버 lab09의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점'섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명 | 대응방안 |
| :--- | :---: | :--- | :--- |
| RiteCMS 초기 로그인 정보 사용 | 최상 | RiteCMS 초기 유저 이름과 비밀번호인 admin / admin 사용 | 로그인 정보 변경 |
| 취약점이 있는 RiteCMS 3.0 버전 사용 | 최상 | 업로드 한 php의 확장자를 pHp로만 바꾸어도 실행이 가능 | 최신 버전 패치 |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261109003704.png]]

대상 서버를 포트 스캔 해보니 `FTP`, `HTTP`, `RPC`, `netbios-ssn`, `HTTPS`, `SMB`, `MySQL`, `RDP`, `HTTPAPI` 총 10개의 포트가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003708.png]]

디렉토리 스캔을 해보니 `dashboard`와 `ecommerce`라는 생소한 페이지가 있다. 페이지를 한 번 더 스캔해본다. `index.php` 가 나오는 것을 보아 `PHP`를 쓰는 페이지인 것을 알 수 있고, 딕셔너리에 `php` 리스트가 잘 없으니 `-x` 옵션으로 `php`를 붙여준다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003712.png]]

그중 `ecommerce`는 `RiteCMS (=PHP로 만든 웹페이지 콘텐츠 관리 시스템(contents management system)) 3.0 demo` 버전이라 명시되어 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003716.png]]

취약점을 찾아보니 3.1.0 버전에서 발견된 원격 접속 취약점이 있다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003720.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003723.png]]

3.1.0 이하에서 발견되는 취약점이니 3.0 demo 버전도 취약 대상이다. `.php` 확장자를 `.pHp`로 바꿔서 올리면 우회가 된다고 적혀 있다. 업로드할 주소를 찾아보자.

![[00. Setting/00. 첨부파일/Pasted image 20261109003728.png]]

`ecommerce`를 바로 스캔하면 디렉토리가 아무것도 나오지 않는다. `--exclude-length 0` 옵션을 붙여 길이가 0인 응답을 숨겨서 건너 뛰고 다음 스캔을 계속한다(옵션 없이는 길이가 0인 응답을 계속 스캔하느라 아무것도 안 나온다). 그럼 `admin.php` -> 관리자 페이지가 나온다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003737.png]]

기본 이름과 비밀번호를 넣어보니 로그인이 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003742.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003745.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003749.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003753.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003756.png]]

`admin` 페이지에서 `Files Manager`에 들어오면 파일 업로드가 가능하다. `.php`를 `.pHp`로 바꿔서 올린다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003800.png]]

주소로 가보면 'Not Found'가 뜬다. 원래 내가 있던 주소는 ecommerce였으니 주소를 고쳐본다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003805.png]]

웹쉘이 잘 실행된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003810.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261109003814.png]]

칼리 서버를 열어주고 리버스쉘을 넣으면 연결이 된다.

![[00. Setting/00. 첨부파일/Pasted image 20261109003817.png]]

administrator 보다 높은 권한인 시스템으로 접속 성공했다.

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

### 6.1 RiteCMS 초기 로그인 정보 사용

  **6.1.1 설명**

- RiteCMS 초기 유저 이름과 비밀번호인 admin / admin을 쓰고 있었다.
- 초기 로그인 정보를 사용하면 공격자가 RiteCMS에 쉽게 접속해 웹 페이지 열람, 변조, 삭제가 가능하다.

  **6.1.2 조치방법**

- 로그인 정보를 쉽게 유추할 수 없는 값으로 변경.

### 6.2 취약점이 있는 RiteCMS 3.0 버전 사용

  **6.2.1 설명**

- RiteCMS 3.0을 대상으로 하는 원격 접속 취약점이 있었다.
- 업로드 한 php의 확장자를 pHp로만 바꾸어도 실행이 가능하다.

  **6.2.2 조치방법**

- RiteCMS를 취약점이 패치된 최신 버전으로 업데이트 한다.
