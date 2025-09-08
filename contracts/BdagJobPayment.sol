// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BdagJobPayment {
    address public owner;

    struct Job {
        uint256 id;
        address client;
        address payable designer;
        uint256 budget;
        string description;
        JobStatus status;
    }

    enum JobStatus { Open, Hired, Completed, Paid }

    struct Designer {
        uint256 hourlyRate;
        string name;
        bool registered;
    }

    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(address => Designer) public designers;

    event JobPosted(uint256 jobId, address client, uint256 budget, string description);
    event DesignerRegistered(address designer, uint256 rate, string name);
    event DesignerHired(uint256 jobId, address designer);
    event JobCompleted(uint256 jobId);
    event PaymentReleased(uint256 jobId, address designer, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function registerDesigner(uint256 _hourlyRate, string memory _name) external {
        designers[msg.sender] = Designer(_hourlyRate, _name, true);
        emit DesignerRegistered(msg.sender, _hourlyRate, _name);
    }

    function postJob(string memory _description, uint256 _budget) external payable {
        require(msg.value == _budget, "Sent BDAG value must match budget");
        jobCounter++;
        jobs[jobCounter] = Job(jobCounter, msg.sender, payable(address(0)), _budget, _description, JobStatus.Open);
        emit JobPosted(jobCounter, msg.sender, _budget, _description);
    }

    function hireDesigner(uint256 _jobId, address _designer) external {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only job client can hire");
        require(job.status == JobStatus.Open, "Job is not open for hiring");
        require(designers[_designer].registered, "Designer is not registered");
        job.designer = payable(_designer);
        job.status = JobStatus.Hired;
        emit DesignerHired(_jobId, _designer);
    }

    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.designer == msg.sender, "Only assigned designer can complete job");
        require(job.status == JobStatus.Hired, "Job must be hired before completion");
        job.status = JobStatus.Completed;
        emit JobCompleted(_jobId);
    }

    function releasePayment(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.client == msg.sender, "Only job client can release payment");
        require(job.status == JobStatus.Completed, "Job must be completed before payment release");
        job.status = JobStatus.Paid;
        job.designer.transfer(job.budget);
        emit PaymentReleased(_jobId, job.designer, job.budget);
    }

    // View functions
    function getJob(uint256 _jobId) external view returns (uint256, address, address, uint256, string memory, JobStatus) {
        Job memory job = jobs[_jobId];
        return (job.id, job.client, job.designer, job.budget, job.description, job.status);
    }

    function getDesigner(address _designer) external view returns (uint256, string memory, bool) {
        Designer memory designer = designers[_designer];
        return (designer.hourlyRate, designer.name, designer.registered);
    }

    function getJobCounter() external view returns (uint256) {
        return jobCounter;
    }
}
