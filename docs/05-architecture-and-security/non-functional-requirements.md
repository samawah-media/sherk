# Non-Functional Requirements: شريك

| ID | Category | Requirement | Measurable Target | Priority | Phase |
| --- | --- | --- | --- | --- | --- |
| NFR-001 | Security | لا cross-tenant/client leakage | 0 known critical findings | Must | V1 |
| NFR-002 | Privacy | internal content never shown to client | E2E pass | Must | V1 |
| NFR-003 | Availability | Pilot usable during business hours | incident log reviewed | Should | Pilot |
| NFR-004 | Reliability | sensitive commands transactional | tests for core commands | Must | V1 |
| NFR-005 | Performance | dashboards load acceptable pilot data | define threshold in Specs | Should | V1 |
| NFR-006 | Scalability | grow beyond 4 clients without redesign | shared schema + indexes later | Should | V1 |
| NFR-007 | Accessibility | responsive and keyboard-friendly basics | manual QA | Should | V1 |
| NFR-008 | RTL/Arabic | Arabic Saudi first | all core screens RTL | Must | V1 |
| NFR-009 | Maintainability | module boundaries documented | architecture docs complete | Must | V1 |
| NFR-010 | Testability | sensitive rules testable | test matrix exists | Must | V1 |
| NFR-011 | Auditability | all sensitive actions audited | audit tests pass | Must | V1 |
| NFR-012 | Recoverability | restore process tested | before production | Must | Prod |
| NFR-013 | Observability | command/job failures visible | dashboards/alerts | Should | Pilot |
| NFR-014 | File Handling | secure upload/download | integration tests | Must | V1 |
| NFR-015 | Concurrency | stale approvals rejected | version tests | Must | V1 |
| NFR-016 | Retention | audit/ledger retention defined | owner decision | Should | Pilot |

