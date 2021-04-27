<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model;

interface IsCheckRequiredInterface
{
    /**
     * Return true if check is required
     *
     * @return bool
     */
    public function execute(): bool;
}
