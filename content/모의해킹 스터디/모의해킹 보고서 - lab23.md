---
publish: true
title: 모의해킹 보고서 - lab23
created: 2026-11-23
modified: 2026-11-24T14:29:54.992Z
published: 2026-11-23
date: 2026-11-23
tags:
description:
lab: lab23
---

## 목차

1. [개요](#1-개요)
2. [총평](#2-총평)
3. [정보 수집 대상](#3-정보-수집-대상)
4. [진단결과 요약](#4-진단결과-요약)
5. [모의해킹 수행 내용](#5-모의해킹-수행-내용)
6. [취약점](#6-취약점)

## 1. 개요

본 보고서는 2026년 11월 23일에 진행된 lab23에 대한 모의해킹 보고서이다.

## 2. 총평

이번 lab23 모의해킹에서는
이는 외부에서 시작된 침해가 서버 전체에 대한 통제권 확보로 확대될 수 있음을 보여준다.

보완을 위해

## 3. 정보 수집 대상

개인 실습 서버 lab23을 대상으로 취약점을 점검했다. 대상 서버 lab23의 IP는 자산 보호 차원에서 가려두었다.

## 4. 진단결과 요약

아래 표는 이번 모의해킹 과정에서 발견된 주요 취약점을 요약한 것이다. 각 취약점에 대한 자세한 설명 및 대응 방안은 본 보고서의 '취약점' 섹션에서 확인할 수 있다.

| 취약점 이름 | 위험도 | 설명  | 대응방안 |
| :----: | :-: | :-: | :--: |
|        |     |     |      |
|        |     |     |      |

## 5. 모의해킹 수행 내용 

![[00. Setting/00. 첨부파일/Pasted image 20261123091553.png]]

대상 서버를 스캔해보니 `SSH`와 `HTTPS`가 열려있다. 호스트 이름도 보인다.
:`fireflow.htb`

![[00. Setting/00. 첨부파일/Pasted image 20261123091802.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261123091745.png]]

호스트 이름을 등록해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261123091905.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261123091932.png]]

웹 페이지를 들어가본다. 일단 `Open Agent` 버튼이 눈에 띈다.

![[00. Setting/00. 첨부파일/Pasted image 20261123094316.png]]

들어 가보려 했더니 무한 로딩에 걸렸다. 가상 호스트 이름이 `flow.fireflow.htb` 인 듯 하다.

![[00. Setting/00. 첨부파일/Pasted image 20261123094009.png]]

`gobuster`로 확인해본다. `HTTPS`이니 인증 우회를 위해 `-k` 옵션을 붙인다.
가상 호스트로 `flow.fireflow.htb`가 나왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261123094104.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261123094051.png]]

가상 호스트도 마찬가지로 등록해준다.

![[00. Setting/00. 첨부파일/Pasted image 20261123094515.png]]

페이지가 제대로 로드 되었다. `Langflow`라는 서비스임을 확인했다. 취약점을 찾기 위해 `Langflow`의 버전을 알아보자.

`Langflow`: AI 앱의 구성 요소를 화면에서 블록처럼 연결해 만드는 도구

![[00. Setting/00. 첨부파일/Pasted image 20261124112057.png]]

웹의 api를 열거하기 위해 `curl`로 요청해보니 명세 주소가 있다고 응답이 왔다.

![[00. Setting/00. 첨부파일/Pasted image 20261124112410.png]]

api 주소를 열거해본다.

![[00. Setting/00. 첨부파일/Pasted image 20261123101653.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123101733.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123102617.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123102837.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123103252.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123103208.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123103236.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123103859.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123103926.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123111718.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123114323.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123115213.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261123115156.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123115302.png]]
![[00. Setting/00. 첨부파일/Pasted image 20261123115252.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123114648.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123114624.png]]

jq

find /var/lib/langflow /opt/langflow -maxdepth 4 -type f ( -name '.env' -o -iname '_config_.yaml' -o -iname '_config_.yml' -o -iname '_config_.json' -o -iname '_config_.toml' ) -print 2>/dev/null

![[00. Setting/00. 첨부파일/Pasted image 20261123153022.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123153003.png]]

n1ghtm4r3\_b4\_n1ghtf4ll

![[00. Setting/00. 첨부파일/Pasted image 20261123153515.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123153542.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123154328.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123162157.png]]

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsYW5nZmxvdy1ib3QiLCJyb2xlIjoidXNlciJ9.RenGdHutrKPCOWjwYSJex8C\_uMSmy7I8AMkhmTwf9Ps

![[00. Setting/00. 첨부파일/Pasted image 20261124091950.png]]

![[00. Setting/00. 첨부파일/Pasted image 20261123173207.png]]

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

<br>; **6.1.2 조치방법**

-
